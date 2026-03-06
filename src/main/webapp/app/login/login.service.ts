import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { Login } from './login.model';
import { Logout } from './logout.model';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly accountService = inject(AccountService);
  private readonly authServerProvider = inject(AuthServerProvider);
  private readonly stateStorageService = inject(StateStorageService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly msalService = inject(MsalService);

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
  }

  /**
   * Initiate SSO login via Microsoft Entra ID redirect flow.
   */
  loginWithSSO(): void {
    this.msalService.loginRedirect({
      scopes: environment.msalConfig.apiScopes,
    });
  }

  /**
   * After MSAL redirect login succeeds, load the user identity from the backend.
   */
  handleSSOLoginSuccess(): Observable<Account | null> {
    return this.accountService.identity(true);
  }

  /**
   * Logout the user.
   * Returns `true` if this is an MSAL redirect logout (caller should NOT navigate).
   */
  logout(): boolean {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (activeAccount) {
      // --- MSAL SSO logout (best-practice cleanup per MS docs) ---

      // 1. Clear application-level cached token (jhi-authenticationToken)
      this.stateStorageService.clearAuthenticationToken();

      // 2. Clear stored redirect URL
      this.stateStorageService.clearUrl();

      // 3. Clear application identity state
      this.accountService.authenticate(null);

      // 4. Trigger MSAL logout redirect – this clears the MSAL token cache
      //    (sessionStorage MSAL keys) and redirects to Microsoft's logout endpoint.
      //    Passing the specific `account` is recommended to log out the correct session.
      this.msalService.logoutRedirect({
        account: activeAccount,
        postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
      });

      return true; // Redirect logout in progress — caller should not navigate
    } else {
      // --- Legacy JWT logout ---
      this.stateStorageService.clearUrl();
      this.authServerProvider.logout().subscribe({
        complete: () => {
          this.accountService.authenticate(null);
        },
      });
      return false;
    }
  }
}
