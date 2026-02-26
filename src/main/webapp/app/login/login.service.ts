import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Login } from './login.model';
import { Logout } from './logout.model';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly accountService = inject(AccountService);
  private readonly authServerProvider = inject(AuthServerProvider);
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

  logout(): void {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (activeAccount) {
      // SSO logout
      this.accountService.authenticate(null);
      this.msalService.logoutRedirect({
        postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
      });
    } else {
      // Legacy JWT logout
      this.authServerProvider.logout().subscribe({
        complete: () => {
          this.accountService.authenticate(null);
        },
      });
    }
  }
}
