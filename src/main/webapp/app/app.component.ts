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
import { InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { AccountService } from './core/auth/account.service';
import { StateStorageService } from './core/auth/state-storage.service';
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
  private readonly stateStorageService = inject(StateStorageService);
  private readonly destroying$ = new Subject<void>();
  private msalAccountChecked = false;

  constructor() {
    this.applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    dayjs.locale(this.languageService.getCurrentLanguage());
    registerLocaleData(locale);
    this.iconLibrary.addIcons(...fontAwesomeIcons);
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    this.matIconRegistry.addSvgIcon('no-data', this.sanitizer.bypassSecurityTrustResourceUrl('../content/svg/no_data.svg'));
  }

  ngOnInit(): void {
    // Process the MSAL redirect response — this returns the access token from the auth code exchange
    this.msalService.handleRedirectObservable().subscribe({
      next: result => {
        if (result?.accessToken) {
          console.log('[MSAL] Redirect login successful, storing access token for:', result.account?.username);
          // Store the MSAL access token so the auth interceptor can attach it to API calls
          this.stateStorageService.storeAuthenticationToken(result.accessToken, false);
          this.msalService.instance.setActiveAccount(result.account);
          this.loadBackendIdentity();
        }
      },
      error: error => {
        console.error('[MSAL] Redirect error:', error);
      },
    });

    // When MSAL finishes all interactions, check for existing accounts (e.g. page refresh with cached session)
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$),
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }

  /**
   * On page refresh: if an MSAL account exists, acquire a fresh token silently and store it.
   */
  private checkAndSetActiveAccount(): void {
    if (this.msalAccountChecked) {
      return;
    }

    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      this.msalAccountChecked = true;

      let activeAccount = this.msalService.instance.getActiveAccount();
      if (!activeAccount) {
        this.msalService.instance.setActiveAccount(accounts[0]);
        activeAccount = accounts[0];
      }

      console.log('[MSAL] Account found:', activeAccount!.username);

      // If we already have a stored token (set by handleRedirectObservable), just load identity
      if (this.stateStorageService.getAuthenticationToken()) {
        this.loadBackendIdentity();
        return;
      }

      // Otherwise (e.g. page refresh), acquire a fresh token silently and store it
      this.msalService.instance
        .acquireTokenSilent({
          scopes: environment.msalConfig.apiScopes,
          account: activeAccount!,
        })
        .then(response => {
          console.log('[MSAL] Silent token acquired for:', activeAccount!.username);
          this.stateStorageService.storeAuthenticationToken(response.accessToken, false);
          this.loadBackendIdentity();
        })
        .catch(error => {
          console.error('[MSAL] Silent token acquisition failed:', error);
          this.msalAccountChecked = false;
        });
    }
  }

  private loadBackendIdentity(): void {
    this.accountService.identity(true).subscribe({
      next: () => console.log('[MSAL] Backend identity loaded'),
      error: error => {
        console.error('[MSAL] Failed to load backend identity:', error);
        this.msalAccountChecked = false;
      },
    });
  }
}
