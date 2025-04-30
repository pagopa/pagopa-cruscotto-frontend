import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { LANGUAGES } from 'app/config/language.constants';
import { IUser, NewUser } from '../user-management.model';
import { UserManagementService } from '../service/user-management.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import PasswordStrengthBarComponent from '../../../shared/password-strength-bar/password-strength-bar.component';
import { IGroup } from '../../group/group.model';
import { EventManager, EventWithContent } from '../../../core/util/event-manager.service';
import { Alert } from '../../../core/util/alert.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { GroupSelectComponent } from '../../group/shared/group-select/group-select.component';

const userTemplate = {} as IUser;

const newUser: IUser = {
  id: null,
  langKey: 'it',
} as IUser;

@Component({
  selector: 'jhi-user-management-update',
  templateUrl: './user-management-update.component.html',
  styleUrls: ['./user-management-update.component.scss'],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgxSpinnerModule,
    RouterModule,
    MatListModule,
    MatSelectModule,
    PasswordStrengthBarComponent,
    GroupSelectComponent,
  ],
})
export default class UserManagementUpdateComponent implements OnInit {
  user: IUser = newUser;
  languages = LANGUAGES;
  isSaving = signal(false);
  doNotMatch = false;

  editForm = new FormGroup({
    id: new FormControl(userTemplate.id),
    login: new FormControl(userTemplate.login, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@A-Za-z0-9-]*')],
    }),
    firstName: new FormControl(userTemplate.firstName, { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    lastName: new FormControl(userTemplate.lastName, { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    email: new FormControl(userTemplate.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(8), Validators.maxLength(100)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(8), Validators.maxLength(100)],
    }),
    langKey: new FormControl(userTemplate.langKey, { nonNullable: true, validators: [Validators.required] }),
    gruppo: new FormControl(userTemplate.groupId ? <IGroup>{ id: userTemplate.groupId } : null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private readonly userService = inject(UserManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      if (user) {
        this.user = user;
        this.updateForm(user);
      } else {
        this.editForm.controls['newPassword'].setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(100)]);
        this.editForm.controls['confirmPassword'].setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(100)]);
        this.editForm.reset(this.user);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.spinner.show('isSaving').then(() => {
      this.isSaving.set(true);
    });

    const newPassword = this.editForm.get(['newPassword'])!.value;
    if (newPassword !== this.editForm.get(['confirmPassword'])!.value) {
      this.spinner.show('isSaving').then(() => {
        this.isSaving.set(false);
      });
      this.addMessage('danger', 'global.messages.error.dontmatch');
    } else {
      this.updateUser(this.user);
      if (this.user.id !== null) {
        this.subscribeToSaveResponse(this.userService.update(this.user));
      } else {
        this.subscribeToSaveResponse(this.userService.create(this.user));
      }
    }
  }

  private updateForm(user: IUser): void {
    this.editForm.patchValue({
      id: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      langKey: user.langKey,
      gruppo: this.createGruppo(user),
    });
  }

  private updateUser(user: IUser): void {
    const gruppo = this.editForm.get(['gruppo'])!.value as IGroup;

    user.login = this.editForm.get(['login'])!.value;
    user.firstName = this.editForm.get(['firstName'])!.value;
    user.lastName = this.editForm.get(['lastName'])!.value;
    user.email = this.editForm.get(['email'])!.value;
    user.langKey = this.editForm.get(['langKey'])!.value;
    user.groupId = gruppo.id;
    user.password = this.editForm.get(['newPassword'])!.value;
  }

  private createGruppo(user: IUser): IGroup | null {
    if (user.groupId === null || user.groupId === undefined) {
      return null;
    } else {
      return {
        id: user.groupId,
        nome: user.groupName,
      } as IGroup;
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  private onSaveSuccess(): void {
    this.previousState();
  }

  private onSaveError(): void {}

  protected onSaveFinalize(): void {
    this.spinner.hide('isSaving').then(() => {
      this.isSaving.set(false);
    });
  }

  private addMessage(alertType: any, message: string): void {
    const jhiAlert: Alert = { type: alertType, translationKey: message };
    this.eventManager.broadcast(new EventWithContent('pagopaCruscottoApp.alert', jhiAlert));
  }
}
