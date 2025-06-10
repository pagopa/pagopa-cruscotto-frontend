import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import SharedModule from 'app/shared/shared.module';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { LocaltionHelper } from 'app/core/location/location.helper';
import { Authority } from 'app/config/authority.constants';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { PagoPaPaymentReceiptService } from '../service/pagoPaPaymentReceipt.service';
import { PagoPaPaymentReceiptFilter } from './pagoPaPaymentReceipt.filter';
import { IPagoPaPaymentReceipt } from '../pagoPaPaymentReceipt.model';

@Component({
  selector: 'jhi-pagoPaPaymentReceipt',
  templateUrl: './pagoPaPaymentReceipt.component.html',
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
  ],
})
export class PagoPaPaymentReceiptComponent implements OnInit {
  displayedColumns: string[] = ['id', 'cfPartner', 'station', 'startDate', 'endDate', 'totRes', 'resOk', 'resKo'];

  locale: string;

  data: IPagoPaPaymentReceipt[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  searchForm;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(PagoPaPaymentReceiptFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);
  private readonly pagoPaPaymentReceiptService = inject(PagoPaPaymentReceiptService);
  private readonly fb = inject(FormBuilder);
  private readonly locationHelper = inject(LocaltionHelper);

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
    void this.router.navigate(['/entity/pagoPaPaymentReceipt']);
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

    this.pagoPaPaymentReceiptService.query(params).subscribe({
      next: (res: HttpResponse<IPagoPaPaymentReceipt[]>) => {
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

  private populateRequest(req: any): any {}

  private populateFilter(): void {
    this.filter.page = this.page;
  }

  previousState(): void {
    window.history.back();
  }

  protected onSuccess(data: IPagoPaPaymentReceipt[], headers: HttpHeaders): void {
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
