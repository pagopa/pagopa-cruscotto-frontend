import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import SharedModule from '../../../shared/shared.module';
import { IPermission } from '../permission.model';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { PermissionFilter } from './permission.filter';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventManager } from '../../../core/util/event-manager.service';
import { PermissionService } from '../service/permission.service';
import { LocaltionHelper } from '../../../core/location/location.helper';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addFilterToRequest, addToFilter, getFilterValue } from '../../../shared/pagination/filter-util.pagination';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalOptions } from '../../../shared/modal/confirm-modal-options.model';
import { ModalResult } from '../../../shared/modal/modal-results.enum';
import { ConfirmModalService } from '../../../shared/modal/confirm-modal.service';

@Component({
  selector: 'jhi-auth-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
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
  ],
})
export class PermissionComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'modulo', 'nome', 'action'];

  data: IPermission[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  confirmSubscriber?: Subscription;

  searchForm;

  protected readonly router = inject(Router);
  protected readonly filter = inject(PermissionFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly permissionService = inject(PermissionService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);
  private readonly confirmModalService = inject(ConfirmModalService);

  constructor() {
    this.searchForm = this.fb.group({
      nome: [null, [Validators.maxLength(100)]],
      modulo: [null, [Validators.maxLength(50)]],
    });

    if (!this.locationHelper.getIsBack()) {
      this.filter.clear();
    }
  }

  ngOnInit(): void {
    this.updateForm();

    if (this.locationHelper.getIsBack()) {
      this.loadPage(this.filter.page, true);
    }
  }

  updateForm(): void {
    this.searchForm.patchValue({
      nome: getFilterValue(this.filter, PermissionFilter.NOME),
      modulo: getFilterValue(this.filter, PermissionFilter.MODULO),
    });
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
    void this.router.navigate(['/admin-users/permissions']);
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

    this.permissionService.query(params).subscribe({
      next: (res: HttpResponse<IPermission[]>) => {
        const data = res.body ?? [];
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
  }

  private populateRequest(req: any): any {
    addFilterToRequest(this.filter, PermissionFilter.NOME, req);
    addFilterToRequest(this.filter, PermissionFilter.MODULO, req);
  }

  private populateFilter(): void {
    addToFilter(this.filter, this.searchForm.get('nome'), PermissionFilter.NOME);
    addToFilter(this.filter, this.searchForm.get('modulo'), PermissionFilter.MODULO);

    this.filter.page = this.page;
  }

  previousState(): void {
    window.history.back();
  }

  delete(row: IPermission): void {
    this.selectedRowId = row.id;
    const confirmOptions = new ConfirmModalOptions(
      'entity.delete.title',
      'pagopaCruscottoApp.authPermission.delete.question',
      undefined,
      {
        id: row.id,
      },
    );

    this.confirmSubscriber = this.confirmModalService
      .delete({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        this.selectedRowId = null;
        if (result === ModalResult.CONFIRMED) {
          this.spinner.show('isLoadingResults').then(() => {
            this.isLoadingResults = true;
          });
          this.permissionService.delete(row.id!).subscribe({
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
      });
  }

  protected onSuccess(data: IPermission[], headers: HttpHeaders): void {
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
