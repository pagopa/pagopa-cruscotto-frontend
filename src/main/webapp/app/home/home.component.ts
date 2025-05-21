import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from '../core/auth/account.model';
import { Router, RouterModule } from '@angular/router';
import { DATE_FORMAT_ISO, HOME_PAGE_DAY_VIEW_ALERT_MESSAGE } from 'app/config/input.constants';
import dayjs from 'dayjs/esm';
import { Authority } from 'app/config/authority.constants';
import SharedModule from '../shared/shared.module';
import { PasswordResetInitOutcomeService } from '../account/password-reset/init/password-reset-init-service.service';
import { EventManager } from '../core/util/event-manager.service';
import { HttpResponse } from '@angular/common/http';
import { IGroup } from '../admin-users/group/group.model';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  passwordResetInitSubscription?: Subscription;
  passwordExpiredDate: string | null = null;
  passwordResetRequestSuccess = false;

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly passwordResetInitOutcomeService = inject(PasswordResetInitOutcomeService);
  private readonly eventManager = inject(EventManager);

  constructor() {
    this.passwordResetInitSubscription = this.passwordResetInitOutcomeService.getSuccess().subscribe({
      next: (value: boolean) => {
        this.passwordResetRequestSuccess = value;

        if (value) {
          setTimeout(() => {
            this.passwordResetInitOutcomeService.sendSuccess(false);
          }, 9000);
        }
      },
    });
  }

  ngOnInit(): void {
    const hasAuthorityChangePasswordExpired = this.accountService.hasAnyAuthority(Authority.CHANGE_PASSWORD_EXPIRED);

    this.authSubscription = this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;

        if (account.passwordExpiredDate) {
          const dateExpired = dayjs(account.passwordExpiredDate).format(DATE_FORMAT_ISO);

          const diffDays = dayjs(account.passwordExpiredDate).diff(dayjs(), 'day', true);

          if (diffDays <= 0 || hasAuthorityChangePasswordExpired) {
            if (hasAuthorityChangePasswordExpired) {
              void this.router.navigate(['/account/password-expired']);
            } else {
              void this.router.navigate(['/login']);
            }
          } else if (diffDays <= HOME_PAGE_DAY_VIEW_ALERT_MESSAGE) {
            this.passwordExpiredDate = dateExpired;
          }
        }
      }
    });
  }

  isNotAuthenticated(): boolean {
    return !this.accountService.isAuthenticated();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.eventManager.destroy(this.authSubscription);
    }

    if (this.passwordResetInitSubscription) {
      this.eventManager.destroy(this.passwordResetInitSubscription);
    }
  }
}
