import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../../core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PasswordService } from './password.service';
import { Router } from '@angular/router';
import { LoginService } from 'app/login/login.service';
import { Alert } from 'app/core/util/alert.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import PasswordStrengthBarComponent from '../../shared/password-strength-bar/password-strength-bar.component';
import SharedModule from '../../shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-password-expired',
  templateUrl: './password-expired.component.html',
  styleUrls: ['./password.component.scss'],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordStrengthBarComponent,
    MatCardModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export default class PasswordExpiredComponent implements OnInit {
  doNotMatch = false;
  authenticationError = false;
  isSaving = false;
  account$?: Observable<Account | null>;

  passwordExpiredForm = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)],
    }),
    passwordNew: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)],
    }),
  });

  private readonly passwordService = inject(PasswordService);
  private readonly accountService = inject(AccountService);
  private readonly eventManager = inject(EventManager);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
  }

  changePassword(): void {
    this.authenticationError = false;
    this.doNotMatch = false;

    const { password, passwordNew, confirmPassword } = this.passwordExpiredForm.getRawValue();

    if (passwordNew !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      this.spinner.show('isSaving').then(() => {
        this.isSaving = true;
      });

      this.passwordService.save(passwordNew, password).subscribe({
        next: () => {
          this.addMessage('success', 'password.messages.success');
          setTimeout(() => {
            this.onSaveFinalize();
            // this.passwordForm.reset();
            this.accountService.authenticate(null);
            this.loginService.logout();
            void this.router.navigate(['login']);
          }, 3000);
        },
        error: (err: any) => {
          this.onSaveFinalize();
          if (err.error?.AuthenticationException) {
            this.authenticationError = true;
          }
        },
      });
    }
  }

  private onSaveFinalize(): void {
    this.spinner.hide('isSaving').then(() => {
      this.isSaving = false;
    });
  }

  private addMessage(alertType: any, message: string): void {
    const jhiAlert: Alert = { type: alertType, translationKey: message };
    this.eventManager.broadcast(new EventWithContent('pagopaCruscottoApp.alert', jhiAlert));
  }
}
