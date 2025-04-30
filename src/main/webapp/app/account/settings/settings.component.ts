import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Alert } from 'app/core/util/alert.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import SharedModule from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

const initialAccount: Account = {} as Account;

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
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
    MatSelectModule,
  ],
})
export default class SettingsComponent implements OnInit {
  languages = LANGUAGES;
  isSaving = false;

  settingsForm = new FormGroup({
    firstName: new FormControl(initialAccount.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAccount.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.email],
    }),
    langKey: new FormControl(initialAccount.langKey, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
    passwordExpiredDate: new FormControl(initialAccount.passwordExpiredDate, { nonNullable: true }),
    id: new FormControl(initialAccount.id, { nonNullable: true }),
  });

  private readonly translateService = inject(TranslateService);
  private readonly accountService = inject(AccountService);
  private readonly eventManager = inject(EventManager);
  private readonly spinner = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);
      }
    });
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving = true;
    });

    const account = this.settingsForm.getRawValue();
    this.accountService
      .save(account)
      .pipe(
        finalize(() => {
          this.onSaveFinalize();
        }),
      )
      .subscribe(() => {
        this.addMessage('success', 'settings.messages.success');

        this.accountService.authenticate(account);

        if (account.langKey !== this.translateService.currentLang) {
          this.translateService.use(account.langKey);
        }
      });
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
