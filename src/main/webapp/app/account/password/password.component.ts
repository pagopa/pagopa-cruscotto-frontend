import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PasswordService } from './password.service';
import { Alert } from 'app/core/util/alert.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'app/login/login.service';
import SharedModule from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import PasswordStrengthBarComponent from '../../shared/password-strength-bar/password-strength-bar.component';

@Component({
  standalone: true,
  selector: 'jhi-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    PasswordStrengthBarComponent,
  ],
})
export default class PasswordComponent implements OnInit {
  doNotMatch = false;
  account$?: Observable<Account | null>;
  isSaving = false;

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl('', {
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
    this.doNotMatch = false;

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      this.spinner.show('isSaving').then(() => {
        this.isSaving = true;
      });

      this.passwordService.save(newPassword, currentPassword).subscribe({
        next: () => {
          this.addMessage('success', 'password.messages.success');
          setTimeout(() => {
            this.onSaveFinalize();
            this.accountService.authenticate(null);
            this.loginService.logout();
            this.router.navigate(['login']);
          }, 3000);
        },
        error: () => {
          this.onSaveFinalize();
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
