import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from './login.service';

/**
 * Lightweight component that replaces the old login page.
 * If the user is already authenticated, redirects to /home.
 * Otherwise, triggers MSAL SSO login redirect immediately.
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

  ngOnInit(): void {
    if (this.accountService.isAuthenticated()) {
      void this.router.navigate(['/home']);
    } else {
      this.loginService.loginWithSSO();
    }
  }
}
