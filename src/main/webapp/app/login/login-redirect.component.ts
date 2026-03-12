import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from './login.service';

/**
 * Lightweight component that replaces the old login page.
 * Waits for MSAL to finish any pending interaction (e.g. redirect processing),
 * then redirects to /home if already authenticated or triggers SSO login.
 */
@Component({
  standalone: true,
  selector: 'jhi-login-redirect',
  template: '',
})
export default class LoginRedirectComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly msalBroadcastService = inject(MsalBroadcastService);

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        take(1),
      )
      .subscribe(() => {
        if (this.accountService.isAuthenticated()) {
          void this.router.navigate(['/home']);
        } else {
          this.loginService.loginWithSSO();
        }
      });
  }
}
