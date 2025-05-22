import { Component, OnInit, AfterViewInit, ElementRef, ChangeDetectorRef, inject, viewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PasswordResetFinishService } from './password-reset-finish.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { Router } from '@angular/router';
import { Alert } from 'app/core/util/alert.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import SharedModule from '../../../shared/shared.module';
import PasswordStrengthBarComponent from '../../../shared/password-strength-bar/password-strength-bar.component';

@Component({
  standalone: true,
  selector: 'jhi-password-reset-finish',
  templateUrl: './password-reset-finish.component.html',
  styleUrls: ['./password-reset-finish.component.scss'],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    PasswordStrengthBarComponent,
  ],
})
export default class PasswordResetFinishComponent implements OnInit, AfterViewInit {
  newPassword = viewChild.required<ElementRef>('newPassword');

  doNotMatch = false;
  error = false;
  isSaving = false;
  key = '';

  passwordForm = new FormGroup({
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)],
    }),
  });

  private readonly passwordResetFinishService = inject(PasswordResetFinishService);
  private readonly eventManager = inject(EventManager);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['key']) {
        this.key = params['key'];
      } else {
        this.addMessage('error', 'reset.finish.messages.keyMissing');
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.newPassword().nativeElement.focus();
    this.changeDetectorRef.detectChanges();
  }

  finishReset(): void {
    this.doNotMatch = false;
    this.error = false;

    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      this.spinner.show('isSaving').then(() => {
        this.isSaving = true;
      });
      this.passwordResetFinishService.save(this.key, newPassword).subscribe({
        next: () => {
          this.addMessage('success', 'reset.finish.messages.success');
          setTimeout(() => {
            this.onSaveFinalize();
            this.router.navigate(['login']);
          }, 3000);
        },
        error: () => {
          this.error = true;
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
