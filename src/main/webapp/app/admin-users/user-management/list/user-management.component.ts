import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { combineLatest, Subscription, take } from 'rxjs';

import SharedModule from 'app/shared/shared.module';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { AccountService } from 'app/core/auth/account.service';
import { UserManagementService } from '../service/user-management.service';
import { IUser, User } from '../user-management.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatCell, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GroupFilter } from '../../group/list/group.filter';
import { EventManager } from '../../../core/util/event-manager.service';
import { LocaltionHelper } from '../../../core/location/location.helper';
import { ConfirmModalService } from '../../../shared/modal/confirm-modal.service';
import { ConfirmModalOptions } from '../../../shared/modal/confirm-modal-options.model';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { UserManagementYesOrNoViewComponent } from '../shared/user-management-yes-or-no-view.component';
import { UserManagementGroupViewComponent } from '../shared/user-management-group-view.component';
import { UserManagementStateViewComponent } from '../shared/user-management-state-view.component';
import { AuthenticationType } from '../../../shared/model/authentication-type.model';
import { ModalResult } from '../../../shared/modal/modal-results.enum';

/* eslint-disable no-console */

@Component({
  selector: 'jhi-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    RouterModule,
    FormatDatePipe,
    UserManagementYesOrNoViewComponent,
    UserManagementGroupViewComponent,
    UserManagementStateViewComponent,
  ],
})
export default class UserManagementComponent implements OnInit, OnDestroy {
  currentAccount = inject(AccountService).trackCurrentAccount();

  authenticationTypeFormLogin = AuthenticationType.FORM_LOGIN;

  displayedColumns: string[] = [
    'id',
    'login',
    'authenticationType',
    'email',
    'stato',
    'langKey',
    'group',
    'createdDate',
    'lastModifiedBy',
    'lastModifiedDate',
    'isBlocked',
    'isDeleted',
    'action',
  ];

  locale: string;

  data: IUser[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  confirmSubscriber?: Subscription;
  loadSubscriber?: Subscription;
  confirmResetSubscriber?: Subscription;

  searchForm;

  protected readonly router = inject(Router);
  protected readonly filter = inject(GroupFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly translateService = inject(TranslateService);
  private readonly userManagementService = inject(UserManagementService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);
  private readonly confirmModalService = inject(ConfirmModalService);

  constructor() {
    this.searchForm = this.fb.group({});

    if (!this.locationHelper.getIsBack()) {
      this.filter.clear();
    }

    this.locale = this.translateService.currentLang;
    this.loadSubscriber = this.eventManager.subscribe('userManagementRefresh', () => this.loadPage(this.filter.page, false));
  }

  ngOnInit(): void {
    this.updateForm();

    if (this.locationHelper.getIsBack()) {
      this.loadPage(this.filter.page, true);
    }

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  updateForm(): void {
    this.searchForm.patchValue({});
    this.page = this.filter.page;
  }

  search(): void {
    this.data = [];
    this.filter.clear();

    this.loadPage(1, true);
  }

  clear(): void {
    this._search = false;
    this.data = [];
    this.filter.clear();
    this.updateForm();
    void this.router.navigate(['/admin-users/user-management']);
  }

  changePage(event: PageEvent): void {
    this.filter.page = event.pageIndex + 1;
    this.updateForm();
    this.loadPage(event.pageIndex + 1, false);
  }

  loadPage(page: number, populateFilter: boolean): void {
    this.spinner.show('isLoadingResults').then(() => {
      this.isLoadingResults = true;
    });

    this._search = true;
    this.page = page;

    if (populateFilter) {
      this.populateFilter();
    }

    const params = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: [this.filter.sort.field + ',' + this.filter.sort.direction],
    };

    this.populateRequest(params);

    this.userManagementService.query(params).subscribe({
      next: (res: HttpResponse<IUser[]>) => {
        const data = res.body ?? [];
        console.log(data);
        this.onSuccess(data, res.headers);
      },
      error: () => this.onError(),
    });
  }

  sortData(sort: Sort): void {
    this.filter.sort = { field: sort.active, direction: sort.direction };
    this.updateForm();
    this.loadPage(this.page, false);
  }

  ngOnDestroy(): void {
    if (this.confirmSubscriber) {
      this.eventManager.destroy(this.confirmSubscriber);
    }
    if (this.loadSubscriber) {
      this.eventManager.destroy(this.loadSubscriber);
    }
    if (this.confirmResetSubscriber) {
      this.eventManager.destroy(this.confirmResetSubscriber);
    }
  }

  private populateRequest(req: any): any {}

  private populateFilter(): void {
    this.filter.page = this.page;
  }

  previousState(): void {
    window.history.back();
  }

  resetPassword(row: IUser): void {
    this.selectedRowId = row.id;
    const confirmOptions = new ConfirmModalOptions('entity.resetPassword.title', 'userManagement.resetPassword.question', undefined, {
      login: row.login,
    });

    this.confirmResetSubscriber = this.confirmModalService
      .save({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        this.selectedRowId = null;
        if (result === ModalResult.CONFIRMED) {
          this.spinner.show('isLoadingResults').then(() => {
            this.isLoadingResults = true;
          });
          if (row.login) {
            this.userManagementService.resetPasswordByLogin(row.login).subscribe({
              next: () => {
                if (
                  this.resultsLength % this.itemsPerPage === 1 &&
                  Math.ceil(this.resultsLength / this.itemsPerPage) === this.page &&
                  this.page !== 1
                ) {
                  this.filter.page = this.page - 1;
                }
                this.loadPage(this.filter.page, false);
              },
              error: () => {
                this.spinner.hide('isLoadingResults').then(() => {
                  this.isLoadingResults = false;
                });
              },
            });
          }
        }
      });
  }

  delete(row: IUser): void {
    this.selectedRowId = row.id;
    const confirmOptions = new ConfirmModalOptions('entity.delete.title', 'userManagement.delete.question', undefined, {
      login: row.login,
    });

    this.confirmSubscriber = this.confirmModalService
      .delete({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        this.selectedRowId = null;
        if (result === ModalResult.CONFIRMED) {
          this.spinner.show('isLoadingResults').then(() => {
            this.isLoadingResults = true;
          });
          if (row.login) {
            this.userManagementService.delete(row.login).subscribe({
              next: () => {
                if (
                  this.resultsLength % this.itemsPerPage === 1 &&
                  Math.ceil(this.resultsLength / this.itemsPerPage) === this.page &&
                  this.page !== 1
                ) {
                  this.filter.page = this.page - 1;
                }
                this.loadPage(this.filter.page, false);
              },
              error: () => {
                this.spinner.hide('isLoadingResults').then(() => {
                  this.isLoadingResults = false;
                });
              },
            });
          }
        }
      });
  }

  protected onSuccess(data: IUser[], headers: HttpHeaders): void {
    this.resultsLength = Number(headers.get('X-Total-Count'));
    this.data = data;
    this.spinner.hide('isLoadingResults').then(() => {
      this.isLoadingResults = false;
    });
  }

  protected onError(): void {
    this.data = [];
    this.spinner.hide('isLoadingResults').then(() => {
      this.isLoadingResults = false;
    });
  }
}
