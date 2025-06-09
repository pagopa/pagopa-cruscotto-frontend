import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ModuleFilter } from './module.filter';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { ConfirmModalOptions } from 'app/shared/modal/confirm-modal-options.model';
import { ConfirmModalService } from 'app/shared/modal/confirm-modal.service';
import { ModalResult } from 'app/shared/modal/modal-results.enum';
import { YesOrNoViewComponent } from 'app/shared/component/yes-or-no-view.component';
import SharedModule from 'app/shared/shared.module';
import { IModule } from '../module.model';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { EventManager } from '../../../core/util/event-manager.service';
import { ModuleService } from '../service/module.service';
import { LocaltionHelper } from 'app/core/location/location.helper';

@Component({
  selector: 'jhi-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
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
    YesOrNoViewComponent,
  ],
})
export class ModuleComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'code', 'name', 'description', 'analysisType', 'allowManualOutcome', 'status', 'action'];

  locale: string;

  data: IModule[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  confirmSubscriber?: Subscription;

  searchForm;

  protected readonly router = inject(Router);
  protected readonly filter = inject(ModuleFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly translateService = inject(TranslateService);
  private readonly moduleService = inject(ModuleService);
  private readonly fb = inject(FormBuilder);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly confirmModalService = inject(ConfirmModalService);

  constructor() {
    this.searchForm = this.fb.group({});

    this.locale = this.translateService.currentLang;

    if (!this.locationHelper.getIsBack()) {
      this.filter.clear();
    }
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
    void this.router.navigate(['/entity/modules']);
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

    this.moduleService.query(params).subscribe({
      next: (res: HttpResponse<IModule[]>) => {
        const data = res.body ?? [];
        this.onSuccess(data, res.headers);
      },
      error: () => this.onError(),
    });
  }

  delete(row: IModule) {
    this.selectedRowId = row.id;
    const confirmOptions = new ConfirmModalOptions('entity.delete.title', 'pagopaCruscottoApp.module.delete.question', undefined, {
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
          this.moduleService.delete(row.id!).subscribe({
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

  private populateRequest(req: any): any {}

  private populateFilter(): void {
    this.filter.page = this.page;
  }

  previousState(): void {
    window.history.back();
  }

  protected onSuccess(data: IModule[], headers: HttpHeaders): void {
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
