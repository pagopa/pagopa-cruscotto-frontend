import { inject, Injectable } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly accountService = inject(AccountService);
  private readonly stateStorageService = inject(StateStorageService);
  private readonly msalService = inject(MsalService);

  loginWithSSO(): void {
    this.msalService.loginRedirect({
      scopes: environment.msalConfig.apiScopes,
    });
  }

  /**
   * Logout the user via MSAL redirect.
   * Returns true to signal that navigation should not be performed by the caller
   * (the MSAL redirect will handle it).
   */
  logout(): boolean {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (activeAccount) {
      this.stateStorageService.clearAuthenticationToken();
      this.stateStorageService.clearUrl();
      this.accountService.authenticate(null);
      this.msalService.logoutRedirect({
        account: activeAccount,
        postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
      });
      return true;
    }
    return false;
  }
}
