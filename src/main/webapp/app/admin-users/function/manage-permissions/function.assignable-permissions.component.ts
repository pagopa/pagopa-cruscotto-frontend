import { Component, effect, inject, input, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventManager } from '../../../core/util/event-manager.service';
import { LocaltionHelper } from '../../../core/location/location.helper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FunctionService } from '../service/function.service';
import { PermissionService } from '../../permission/service/permission.service';
import { IPermission } from '../../permission/permission.model';
import { FunctionAssignablePermissionsFilter } from './function.assignable-permissions.filter';
import { addFilterToRequest, addValueToFilter, getFilterValue } from '../../../shared/pagination/filter-util.pagination';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { Authority } from 'app/config/authority.constants';

/* eslint-disable no-console */

@Component({
  selector: 'jhi-auth-function-assignable-permissions',
  templateUrl: './function.assignable-permissions.component.html',
  styleUrls: ['./function.assignable-permissions.component.scss'],
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
    MatCheckboxModule,
    MatBadgeModule,
  ],
})
export class FunctionAssignablePermissionsComponent implements OnDestroy {
  functionId = input.required<number>();

  displayedColumns: string[] = ['action', 'id', 'modulo', 'nome'];

  selection = new SelectionModel<IPermission>(true, [], true, (otherValue: IPermission, value: IPermission) => {
    return otherValue.id === value.id;
  });

  maxCheckboxSelected = 100;
  data: IPermission[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  filterValue = '';

  isLoadingResults = false;
  selectedRowId: any;

  loadSubscriber?: Subscription;
  confirmSubscriber?: Subscription;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(FunctionAssignablePermissionsFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly functionService = inject(FunctionService);
  private readonly permissionService = inject(PermissionService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly confirmModalService = inject(ConfirmModalService);

  constructor() {
    effect(() => {
      if (!this.locationHelper.getIsBack()) {
        this.filter.clear();
      }

      this.updateForm();

      this.loadPage(this.filter.page, true);
      this.selection.clear();

      this.loadSubscriber = this.eventManager.subscribe('assignablePermissionsRefresh', () => this.loadPage(this.filter.page, false));
    });
  }

  updateForm(): void {
    this.filterValue = getFilterValue(this.filter, FunctionAssignablePermissionsFilter.NOME);
    this.page = this.filter.page;
  }

  changePage(event: PageEvent): void {
    this.filter.page = event.pageIndex + 1;
    this.updateForm();
    this.loadPage(event.pageIndex + 1, false);
  }

  loadPage(page: number, populateFilter: boolean): void {
    this.spinner.show('isLoadingAssignablePermissions').then(() => {
      this.isLoadingResults = true;
    });

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

    this.permissionService.findPermessiAssociabiliByFunzione(this.functionId(), params).subscribe({
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
    if (this.loadSubscriber) {
      this.eventManager.destroy(this.loadSubscriber);
    }
  }

  private populateFilter(): void {
    this.filter.page = this.page;
  }

  associaPermessi(): void {
    const confirmOptions = new ConfirmModalOptions(
      'pagopaCruscottoApp.authFunction.managePermissions.assignablePermissions.question.title',
      'pagopaCruscottoApp.authFunction.managePermissions.assignablePermissions.question.message',
      undefined,
      undefined,
    );

    this.confirmSubscriber = this.confirmModalService
      .save({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        if (result === ModalResult.CONFIRMED) {
          this.spinner.show('isLoadingAssignablePermissions').then(() => {
            this.isLoadingResults = true;
          });
          this.functionService.associaPermesso(this.selection.selected, this.functionId()).subscribe({
            next: () => {
              let selected = this.countSelectedForPage();

              let page = this.data.length === selected && this.filter.page !== 1 ? this.filter.page - 1 : this.filter.page;

              this.selection.clear(true);
              this.loadPage(page, true);
              this.eventManager.broadcast('associatedPermissionsRefresh');
            },
            error: () => {
              this.spinner.hide('isLoadingAssignablePermissions').then(() => {
                this.isLoadingResults = false;
              });
            },
          });
        }
      });
  }

  private populateRequest(req: any): any {
    addFilterToRequest(this.filter, FunctionAssignablePermissionsFilter.NOME, req);
  }

  modelChangeFn(value: any) {
    addValueToFilter(this.filter, value, FunctionAssignablePermissionsFilter.NOME);

    if (value.length > 3 || value.length == 0) {
      this.loadPage(1, true);
      this.selection.clear();
    }
  }

  removeFilter($event: any): void {
    $event.stopPropagation();
    this.filterValue = '';
    this.filter.clear();
    this.loadPage(1, true);
    this.selection.clear();
  }

  isAllSelected(): boolean {
    let selected = this.countSelectedForPage();

    return selected > 0 && selected == this.data.length;
  }

  isPartialPageSelected(): boolean {
    let selected = this.countSelectedForPage();

    return selected > 0 && selected < this.data.length;
  }

  onCheckRowSelected(row: IPermission): boolean {
    return this.selection.isSelected(row);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(event: MatCheckboxChange): void {
    this.data.forEach(row => {
      if (!this.selection.isSelected(row) && event.checked && this.selection.selected.length < this.maxCheckboxSelected) {
        this.selection.select(row);
      } else if (this.selection.isSelected(row) && !event.checked) {
        this.selection.deselect(row);
      }
    });
  }

  protected countSelectedForPage(): number {
    let selected = 0;

    this.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        selected++;
      }
    });

    return selected;
  }

  protected onSuccess(data: IPermission[], headers: HttpHeaders): void {
    this.resultsLength = Number(headers.get('X-Total-Count'));
    this.data = data;
    this.spinner.hide('isLoadingAssignablePermissions').then(() => {
      this.isLoadingResults = false;
    });
  }

  protected onError(): void {
    this.data = [];
    this.spinner.hide('isLoadingAssignablePermissions').then(() => {
      this.isLoadingResults = false;
    });
  }
}
