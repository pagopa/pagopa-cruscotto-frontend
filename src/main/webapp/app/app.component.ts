import { Component, inject, OnInit } from '@angular/core';
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
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { AccountService } from './core/auth/account.service';
import { StateStorageService } from './core/auth/state-storage.service';

@Component({
  selector: 'jhi-app',
  template: '<jhi-main></jhi-main>',
  imports: [MainComponent],
})
export default class AppComponent implements OnInit {
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly iconLibrary = inject(FaIconLibrary);
  private readonly languageService = inject(LanguageService);
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly msalService = inject(MsalService);
  private readonly accountService = inject(AccountService);
  private readonly stateStorageService = inject(StateStorageService);
  private msalAccountChecked = false;
  private redirectAccount: AccountInfo | null = null;

  constructor() {
    this.applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    dayjs.locale(this.languageService.getCurrentLanguage());
    registerLocaleData(locale);
    this.iconLibrary.addIcons(...fontAwesomeIcons);
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    this.matIconRegistry.addSvgIcon('no-data', this.sanitizer.bypassSecurityTrustResourceUrl('../content/svg/no_data.svg'));
  }

  ngOnInit(): void {
    // Process redirect first, then resolve cached account state.
    // Calling backend identity before redirect completion can race with MSAL interaction finalization.
    this.msalService.handleRedirectObservable().subscribe({
      next: result => {
        if (result?.account) {
          console.log('[MSAL] Redirect login successful for:', result.account.username);
          this.redirectAccount = result.account;
          this.msalService.instance.setActiveAccount(result.account);
        }

        if (result?.accessToken) {
          // Store the redirect token; subsequent API calls may still refresh silently via interceptor.
          this.stateStorageService.storeAuthenticationToken(result.accessToken, false);
        }
      },
      error: error => {
        console.error('[MSAL] Redirect error:', error);
        this.checkAndSetActiveAccount();
      },
      complete: () => {
        this.checkAndSetActiveAccount();
      },
    });
  }

  /**
   * Resolve auth state after MSAL redirect handling finishes.
   */
  private checkAndSetActiveAccount(): void {
    if (this.msalAccountChecked) {
      return;
    }

    const accounts = this.msalService.instance.getAllAccounts();
    const activeOrRedirectAccount = this.msalService.instance.getActiveAccount() ?? this.redirectAccount;

    if (accounts.length > 0 || activeOrRedirectAccount) {
      this.msalAccountChecked = true;

      let activeAccount = this.msalService.instance.getActiveAccount();
      if (!activeAccount) {
        const fallbackAccount = accounts[0] ?? this.redirectAccount;
        if (fallbackAccount) {
          this.msalService.instance.setActiveAccount(fallbackAccount);
          activeAccount = fallbackAccount;
        }
      }

      if (activeAccount) {
        console.log('[MSAL] Account found:', activeAccount.username);
      }

      // Let the auth interceptor silently acquire/refresh the token for /api/account.
      this.loadBackendIdentity();
    } else {
      // No MSAL session — mark as checked and emit null so all subscribers (HomeComponent, guards) resolve
      this.msalAccountChecked = true;
      this.accountService.authenticate(null);
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
