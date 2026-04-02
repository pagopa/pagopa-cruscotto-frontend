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

  loginAsTestUser(): void {
    this.stateStorageService.storeAuthenticationToken(environment.TEST_TOKEN, false);
    this.accountService.identity(true).subscribe({
      error: () => {
        this.stateStorageService.clearAuthenticationToken();
        this.accountService.authenticate(null);
      },
    });
  }

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
    // Test user logout — clear stored token and reset identity state
    this.stateStorageService.clearAuthenticationToken();
    this.stateStorageService.clearUrl();
    this.accountService.authenticate(null);
    return false;
  }
}
