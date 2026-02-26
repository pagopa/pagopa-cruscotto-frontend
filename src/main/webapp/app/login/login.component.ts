import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import SharedModule from '../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StateStorageService } from '../core/auth/state-storage.service';
import { MsalService } from '@azure/msal-angular';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'jhi-login',
  templateUrl: './login.component.html',
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    NgxSpinnerModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
})
export default class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: false })
  username!: ElementRef;

  authenticationError = false;
  userLockedError = false;
  isLoggingIn = false;

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(true, { nonNullable: true }),
  });

  private readonly accountService = inject(AccountService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly stateStorageService = inject(StateStorageService);
  private readonly msalService = inject(MsalService);

  ngOnInit(): void {
    // Check if user is already authenticated (JWT or MSAL)
    this.accountService.identity().subscribe({
      next: account => {
        if (this.accountService.isAuthenticated()) {
          // User is authenticated, navigate to home
          void this.router.navigate(['home']);
          return;
        }

        // Check if user has MSAL session but identity loading failed
        const activeAccount = this.msalService.instance.getActiveAccount();
        if (activeAccount) {
          // User is MSAL authenticated but backend identity failed to load
          // Try to handle SSO login success
          this.loginService.handleSSOLoginSuccess().subscribe({
            next: () => {
              if (this.accountService.isAuthenticated()) {
                void this.router.navigate(['home']);
              }
            },
            error: error => {
              console.error('Failed to handle SSO login success:', error);
              // Clear MSAL session if identity loading fails
              this.msalService.instance.setActiveAccount(null);
              this.stateStorageService.clearAuthenticationToken();
            },
          });
        }
      },
      error: error => {
        console.error('Identity check failed:', error);
      },
    });
  }

  ngAfterViewInit(): void {
    this.username.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
  }

  login(): void {
    this.authenticationError = false;
    this.userLockedError = false;
    this.spinner.show('isLoggingIn').then(() => {
      this.isLoggingIn = true;
    });

    this.loginService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => this.onSaveFinalize()))
      .subscribe({
        next: () => {
          if (!this.router.getCurrentNavigation()) {
            if (this.router.url.startsWith('finishReset') || this.router.url.startsWith('requestReset')) {
              void this.router.navigate(['']);
            }
          }

          // previousState was set in the authExpiredInterceptor before being redirected to login modal.
          // since login is successful, go to stored previousState and clear previousState
          const redirect = this.stateStorageService.getUrl();

          if (redirect) {
            void this.router.navigateByUrl(redirect);
          } else {
            void this.router.navigate(['']);
          }
        },
        error: (err: any) => {
          if (err.error?.LockedException) {
            this.userLockedError = true;
          } else {
            this.authenticationError = true;
          }
        },
      });
  }

  loginWithSSO(): void {
    this.loginService.loginWithSSO();
  }

  protected onSaveFinalize(): void {
    this.spinner.hide('isLoggingIn').then(() => {
      this.isLoggingIn = false;
    });
  }
}
