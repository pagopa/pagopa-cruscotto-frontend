import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import dayjs from 'dayjs/esm';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import locale from '@angular/common/locales/it';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { LanguageService } from './shared/language/language.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MainComponent } from './layouts/main/main.component';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus, SilentRequest } from '@azure/msal-browser';
import { Subject, filter, takeUntil, catchError, of } from 'rxjs';
import { AccountService } from './core/auth/account.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'jhi-app',
  template: '<jhi-main></jhi-main>',
  imports: [MainComponent],
})
export default class AppComponent implements OnInit, OnDestroy {
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly iconLibrary = inject(FaIconLibrary);
  private readonly languageService = inject(LanguageService);
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly msalService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly accountService = inject(AccountService);
  private readonly destroying$ = new Subject<void>();

  constructor() {
    this.applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    dayjs.locale(this.languageService.getCurrentLanguage());
    registerLocaleData(locale);
    this.iconLibrary.addIcons(...fontAwesomeIcons);
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    this.matIconRegistry.addSvgIcon('no-data', this.sanitizer.bypassSecurityTrustResourceUrl('../content/svg/no_data.svg'));
  }

  ngOnInit(): void {
    // this.msalService.handleRedirectObservable().subscribe();

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$),
      )
      .subscribe(async () => {
        await this.checkAndSetActiveAccount();
      });

    // Also check for existing sessions on app initialization
    this.checkAndSetActiveAccount();
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }

  /**
   * Check for existing MSAL accounts and attempt silent login.
   * If an account exists, try to acquire a token silently to verify the session is still valid.
   * If successful, load the backend identity; otherwise, user will need to log in.
   */
  private async checkAndSetActiveAccount(): Promise<void> {
    const accounts = this.msalService.instance.getAllAccounts();

    if (accounts.length > 0) {
      // Set the first account as active if none is set
      let activeAccount = this.msalService.instance.getActiveAccount();
      if (!activeAccount) {
        this.msalService.instance.setActiveAccount(accounts[0]);
        activeAccount = accounts[0];
      }

      if (activeAccount) {
        // Try to acquire token silently to verify session is still valid
        const silentRequest: SilentRequest = {
          scopes: environment.msalConfig.apiScopes,
          account: activeAccount,
        };

        try {
          const response = await this.msalService.instance.acquireTokenSilent(silentRequest);
          if (response.accessToken) {
            if (environment.DEBUG_INFO_ENABLED) {
              console.log('Silent login successful for user:', activeAccount.username);
            }
            // Session is valid, load backend identity
            this.accountService.identity(true).subscribe({
              next: () => {
                if (environment.DEBUG_INFO_ENABLED) {
                  console.log('Backend identity loaded successfully');
                }
              },
              error: error => {
                console.error('Failed to load backend identity:', error);
              },
            });
          }
        } catch (error: any) {
          // Silent token acquisition failed
          if (environment.DEBUG_INFO_ENABLED) {
            console.log('Silent token acquisition failed:', error);
          }

          // If the error indicates interaction is required, clear the active account
          // so the user will be prompted to log in again
          if (
            error.errorCode === 'interaction_required' ||
            error.errorCode === 'consent_required' ||
            error.errorCode === 'login_required'
          ) {
            if (environment.DEBUG_INFO_ENABLED) {
              console.log('Session expired, user needs to log in again');
            }
            this.msalService.instance.setActiveAccount(null);
          }
        }
      }
    } else {
      if (environment.DEBUG_INFO_ENABLED) {
        console.log('No existing MSAL accounts found');
      }
    }
  }
}
