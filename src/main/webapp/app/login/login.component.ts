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

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        void this.router.navigate(['home']);
      }
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
              this.router.navigate(['']);
            }
          }

          // previousState was set in the authExpiredInterceptor before being redirected to login modal.
          // since login is successful, go to stored previousState and clear previousState
          const redirect = this.stateStorageService.getUrl();

          if (redirect) {
            this.router.navigateByUrl(redirect);
          } else {
            this.router.navigate(['']);
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

  protected onSaveFinalize(): void {
    this.spinner.hide('isLoggingIn').then(() => {
      this.isLoggingIn = false;
    });
  }
}
