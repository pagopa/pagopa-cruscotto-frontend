import { Component, effect, inject, input, Input } from '@angular/core';
import SharedModule from '../../../shared/shared.module';
import { UserManagementService } from '../service/user-management.service';
import { EventManager } from '../../../core/util/event-manager.service';
import { AccountService } from '../../../core/auth/account.service';
import { IUser } from '../user-management.model';
import { AuthenticationType } from '../../../shared/model/authentication-type.model';
import { Authority } from '../../../config/authority.constants';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { ConfirmModalService } from '../../../shared/modal/confirm-modal.service';
import { ConfirmModalOptions } from '../../../shared/modal/confirm-modal-options.model';
import { ModalResult } from '../../../shared/modal/modal-results.enum';

/* eslint-disable no-console */
@Component({
  selector: 'jhi-user-management-state-view',
  template: `
    <div *ngIf="editable()">
      <mat-slide-toggle [(ngModel)]="isChecked" (click)="setActive(user())">
        @if (user().activated && !user().deleted) {
          {{ 'pagopaCruscottoApp.userState.activated' | translate }}
        } @else if (!user().activated && !user().deleted) {
          {{ 'pagopaCruscottoApp.userState.deactivated' | translate }}
        } @else {
          {{ 'pagopaCruscottoApp.userState.deleted' | translate }}
        }
      </mat-slide-toggle>
    </div>
    <div *ngIf="disabled()">
      <mat-slide-toggle [(ngModel)]="isChecked" disabled="disabled">
        @if (user().activated && !user().deleted) {
          {{ 'pagopaCruscottoApp.userState.activated' | translate }}
        } @else if (!user().activated && !user().deleted) {
          {{ 'pagopaCruscottoApp.userState.deactivated' | translate }}
        } @else {
          {{ 'pagopaCruscottoApp.userState.deleted' | translate }}
        }
      </mat-slide-toggle>
    </div>
  `,
  imports: [SharedModule, MatSlideToggleModule, FormsModule],
})
export class UserManagementStateViewComponent {
  currentAccount = inject(AccountService).trackCurrentAccount();
  user = input.required<IUser>();

  confirmSubscriber?: Subscription;
  isChecked?: boolean;

  private readonly userManagementService = inject(UserManagementService);
  private readonly eventManager = inject(EventManager);
  private readonly accountService = inject(AccountService);
  private readonly confirmModalService = inject(ConfirmModalService);

  authenticationTypeFormLogin = AuthenticationType.FORM_LOGIN;
  authenticationTypeOauth2 = AuthenticationType.OAUHT2;

  constructor() {
    effect(() => {
      this.isChecked = this.user().activated;
    });
  }

  setActive(user: IUser): void {
    const confirmOptions = new ConfirmModalOptions(
      'userManagement.changeState.question.title',
      'userManagement.changeState.question.message',
      undefined,
      undefined,
    );

    this.confirmSubscriber = this.confirmModalService
      .save({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        if (result === ModalResult.CONFIRMED) {
          if (user.id) {
            this.userManagementService.changeState(user.id).subscribe({
              next: () => {
                this.user().activated = !this.user().activated;
                this.eventManager.broadcast('userManagementRefresh');
              },
              error: () => (this.isChecked = !this.isChecked),
            });
          }
        } else {
          this.isChecked = !this.isChecked;
        }
      });
  }

  editable(): boolean {
    return (
      this.accountService.hasAnyAuthority(Authority.USER_MANAGEMENT) &&
      this.user().authenticationType === this.authenticationTypeFormLogin &&
      this.currentAccount() !== null &&
      this.currentAccount()?.login !== this.user().login &&
      !this.user().deleted
    );
  }

  disabled(): boolean {
    return (
      !this.accountService.hasAnyAuthority(Authority.USER_MANAGEMENT) ||
      this.user().authenticationType === this.authenticationTypeOauth2 ||
      !this.currentAccount() ||
      this.currentAccount()?.login === this.user().login ||
      (this.user().deleted ?? false)
    );
  }
}
