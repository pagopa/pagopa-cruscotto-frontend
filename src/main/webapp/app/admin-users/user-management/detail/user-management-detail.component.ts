import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';

import { User } from '../user-management.model';
import { AccountService } from '../../../core/auth/account.service';
import { AuthenticationType } from '../../../shared/model/authentication-type.model';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { UserManagementStateViewComponent } from '../shared/user-management-state-view.component';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { Authority } from 'app/config/authority.constants';

@Component({
  selector: 'jhi-user-management-detail',
  templateUrl: './user-management-detail.component.html',
  imports: [RouterModule, SharedModule, MatButton, MatIcon, MatCard, MatCardContent, UserManagementStateViewComponent, FormatDatePipe],
})
export default class UserManagementDetailComponent implements OnInit {
  user = input<User | null>(null);
  currentAccount = inject(AccountService).trackCurrentAccount();
  authenticationTypeFormLogin = AuthenticationType.FORM_LOGIN;
  locale: string;

  protected readonly Authority = Authority;

  private readonly translateService = inject(TranslateService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
