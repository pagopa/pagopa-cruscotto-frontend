import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventManager } from '../../../core/util/event-manager.service';
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
import { GroupFilter } from './group.filter';
import { GroupService } from '../service/group.service';
import { IGroup } from '../group.model';
import { Authority } from 'app/config/authority.constants';

@Component({
  selector: 'jhi-auth-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
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
export class GroupComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'nome', 'descrizione', 'livello', 'action'];

  data: IGroup[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  confirmSubscriber?: Subscription;

  searchForm;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(GroupFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly groupService = inject(GroupService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);
  private readonly confirmModalService = inject(ConfirmModalService);

  constructor() {
    this.searchForm = this.fb.group({
      nome: [null, [Validators.maxLength(100)]],
      descrizione: [null, [Validators.maxLength(50)]],
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
      nome: getFilterValue(this.filter, GroupFilter.NOME),
      descrizione: getFilterValue(this.filter, GroupFilter.DESCRIZIONE),
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
    void this.router.navigate(['/admin-users/groups']);
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

    this.groupService.query(params).subscribe({
      next: (res: HttpResponse<IGroup[]>) => {
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
    addFilterToRequest(this.filter, GroupFilter.NOME, req);
    addFilterToRequest(this.filter, GroupFilter.DESCRIZIONE, req);
  }

  private populateFilter(): void {
    addToFilter(this.filter, this.searchForm.get('nome'), GroupFilter.NOME);
    addToFilter(this.filter, this.searchForm.get('descrizione'), GroupFilter.DESCRIZIONE);

    this.filter.page = this.page;
  }

  previousState(): void {
    window.history.back();
  }

  delete(row: IGroup): void {
    this.selectedRowId = row.id;
    const confirmOptions = new ConfirmModalOptions('entity.delete.title', 'pagopaCruscottoApp.authGroup.delete.question', undefined, {
      id: row.id,
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
          this.groupService.delete(row.id!).subscribe({
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

  protected onSuccess(data: IGroup[], headers: HttpHeaders): void {
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
