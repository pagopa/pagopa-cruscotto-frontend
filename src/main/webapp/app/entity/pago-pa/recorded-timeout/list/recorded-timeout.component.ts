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
import { FormatDatePipe } from '../../../../shared/date';
import { RecordedTimeoutFilter } from './recorded-timeout.filter';
import { RecordedTimeoutService } from '../service/recorded-timeout.service';
import { IPagoPaRecordedTimeout } from '../recorded-timeout.model';
import { PartnerSelectComponent } from 'app/entity/partner/shared/partner-select/partner-select.component';
import { StationSelectComponent } from 'app/entity/station/shared/station-select/station-select.component';
import { addFilterToRequest, getFilterValue } from '../../../../shared/pagination/filter-util.pagination';
import { IPartner } from 'app/entity/partner/partner.model';
import { IStation } from 'app/entity/station/station.model';

@Component({
  selector: 'jhi-pago-pa-recorded-timeout',
  templateUrl: './recorded-timeout.component.html',
  styleUrl: './recorded-timeout.component.scss',
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
    PartnerSelectComponent,
    StationSelectComponent,
  ],
})
export class PagoPaRecordedTimeoutComponent implements OnInit {
  displayedColumns: string[] = ['cfPartner', 'station', 'method', 'startDate', 'endDate', 'totReq', 'reqOk', 'reqTimeout', 'avgTime'];

  locale: string;

  data: IPagoPaRecordedTimeout[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  searchForm;

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(RecordedTimeoutFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);
  private readonly pagoPaRecordedTimeoutService = inject(RecordedTimeoutService);
  private readonly fb = inject(FormBuilder);
  private readonly locationHelper = inject(LocaltionHelper);

  constructor() {
    this.searchForm = this.fb.group({
      partner: [''],
      station: [''],
    });

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
    this.searchForm.patchValue({
      partner: getFilterValue(this.filter, RecordedTimeoutFilter.PARTNER),
      station: getFilterValue(this.filter, RecordedTimeoutFilter.STATION),
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
    void this.router.navigate(['/entity/pago-pa/recorded-timeout']);
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

    this.pagoPaRecordedTimeoutService.query(params).subscribe({
      next: (res: HttpResponse<IPagoPaRecordedTimeout[]>) => {
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

  private populateRequest(req: any): any {
    addFilterToRequest(this.filter, RecordedTimeoutFilter.PARTNER, req);
    addFilterToRequest(this.filter, RecordedTimeoutFilter.STATION, req);
  }

  private populateFilter(): void {
    this.filter.page = this.page;
    const partner = this.searchForm.get('partner')?.value as unknown as IPartner;
    this.filter.filters['cfPartner'] = partner?.fiscalCode;
    const station = this.searchForm.get('station')?.value as unknown as IStation;
    this.filter.filters['station'] = station?.name;
  }

  previousState(): void {
    window.history.back();
  }

  protected onSuccess(data: IPagoPaRecordedTimeout[], headers: HttpHeaders): void {
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
