import { Component, AfterViewInit, ElementRef, ChangeDetectorRef, inject, viewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { PasswordResetInitService } from './password-reset-init.service';
import { PasswordResetInitOutcomeService } from './password-reset-init-service.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Alert } from 'app/core/util/alert.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import SharedModule from '../../../shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-password-reset-init',
  templateUrl: './password-reset-init.component.html',
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export default class PasswordResetInitComponent implements AfterViewInit {
  email = viewChild.required<ElementRef>('email');

  success = false;
  isProcessing = false;
  errorEmailNotExists = false;

  resetRequestForm = new FormGroup({
    email: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.email],
    }),
  });

  private readonly passwordResetInitService = inject(PasswordResetInitService);
  private readonly passwordResetInitOutcomeService = inject(PasswordResetInitOutcomeService);
  private readonly eventManager = inject(EventManager);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.email().nativeElement.focus();
    this.changeDetectorRef.detectChanges();
  }

  requestReset(): void {
    this.success = false;
    this.errorEmailNotExists = false;

    this.spinner.show('isProcessing').then(() => {
      this.isProcessing = true;
    });

    this.passwordResetInitService
      .save(this.resetRequestForm.get(['email'])!.value)
      .pipe(
        finalize(() => {
          this.onSaveFinalize();
        }),
      )
      .subscribe({
        next: () => {
          this.success = true;
          this.addMessage('success', 'reset.request.messages.success');
          this.passwordResetInitOutcomeService.sendSuccess(true);
          void this.router.navigate(['']);
        },
        error: (response: any) => {
          if (response.status === 400 && response.error === 'email address not registered') {
            this.errorEmailNotExists = true;
          }
        },
      });
  }

  private onSaveFinalize(): void {
    this.spinner.hide('isProcessing').then(() => {
      this.isProcessing = false;
    });
  }

  private addMessage(alertType: any, message: string): void {
    const jhiAlert: Alert = { type: alertType, translationKey: message };
    this.eventManager.broadcast(new EventWithContent('easysiopeNewApp.alert', jhiAlert));
  }
}
