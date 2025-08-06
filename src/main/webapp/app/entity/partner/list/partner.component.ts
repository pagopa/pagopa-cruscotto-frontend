import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LocaltionHelper } from '../../../core/location/location.helper';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatRadioModule } from '@angular/material/radio';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PartnerFilter } from './partner.filter';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { Authority } from 'app/config/authority.constants';
import { IPartner, StatusOptions } from '../partner.model';
import { PartnerService } from '../service/partner.service';
import { YesOrNoViewComponent } from 'app/shared/component/yes-or-no-view.component';
import { PartnerSelectComponent } from '../shared/partner-select/partner-select.component';
import { MatOptionModule } from '@angular/material/core';
import dayjs from '../../../config/dayjs';
import { datepickerRangeValidatorFn } from 'app/shared/util/validator-util';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { addFilterToRequest, addToFilter, getFilterValue } from 'app/shared/pagination/filter-util.pagination';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'jhi-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatOptionModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    RouterModule,
    FormatDatePipe,
    YesOrNoViewComponent,
    PartnerSelectComponent,
    MatRadioModule,
  ],
})
export class PartnerComponent implements OnInit {
  displayedColumns: string[] = [
    'fiscalCode',
    'name',
    'qualified',
    'lastAnalysisDate',
    'analysisPeriod',
    'stationsCount',
    'associatedInstitutes',
    'action',
  ];

  data: IPartner[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  searchForm;

  locale: string;

  status = StatusOptions;
  statusOptions: StatusOptions[] = Object.values(StatusOptions);

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(PartnerFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly partnerService = inject(PartnerService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.searchForm = this.fb.group(
      {
        partner: [''],
        analized: [''],
        qualified: [''],
        lastAnalysisDate: new FormControl<dayjs.Dayjs | null>(null),
        analysisPeriodStartDate: new FormControl<dayjs.Dayjs | null>(null),
        analysisPeriodEndDate: new FormControl<dayjs.Dayjs | null>(null),
        showNotActive: [''],
      },
      {
        validators: [datepickerRangeValidatorFn('analysisPeriodStartDate', 'analysisPeriodEndDate')],
      },
    );

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
      partner: getFilterValue(this.filter, PartnerFilter.PARTNER),
      analized: getFilterValue(this.filter, PartnerFilter.ANALIZED),
      qualified: getFilterValue(this.filter, PartnerFilter.QUALIFIED),
      lastAnalysisDate: getFilterValue(this.filter, PartnerFilter.LAST_ANALYSIS_DATE),
      analysisPeriodStartDate: getFilterValue(this.filter, PartnerFilter.ANALYSIS_PERIOD_START_DATE),
      analysisPeriodEndDate: getFilterValue(this.filter, PartnerFilter.ANALYSIS_PERIOD_END_DATE),
      showNotActive: getFilterValue(this.filter, PartnerFilter.SHOW_NOT_ACTIVE),
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
    void this.router.navigate(['/entity/partners']);
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

    this.partnerService.query(params).subscribe({
      next: (res: HttpResponse<IPartner[]>) => {
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
    addFilterToRequest(this.filter, PartnerFilter.PARTNER, req);
    addFilterToRequest(this.filter, PartnerFilter.ANALIZED, req);
    addFilterToRequest(this.filter, PartnerFilter.QUALIFIED, req);
    addFilterToRequest(this.filter, PartnerFilter.ANALYSIS_PERIOD_START_DATE, req);
    addFilterToRequest(this.filter, PartnerFilter.ANALYSIS_PERIOD_END_DATE, req);
    addFilterToRequest(this.filter, PartnerFilter.LAST_ANALYSIS_DATE, req);
    addFilterToRequest(this.filter, PartnerFilter.SHOW_NOT_ACTIVE, req);
  }

  private populateFilter(): void {
    // this.filter.page = this.page;
    addToFilter(this.filter, this.searchForm.get('partner'), PartnerFilter.PARTNER);
    addToFilter(this.filter, this.searchForm.get('analized'), PartnerFilter.ANALIZED);
    addToFilter(this.filter, this.searchForm.get('qualified'), PartnerFilter.QUALIFIED);
    addToFilter(this.filter, this.searchForm.get('analysisPeriodStartDate'), PartnerFilter.ANALYSIS_PERIOD_START_DATE);
    addToFilter(this.filter, this.searchForm.get('analysisPeriodEndDate'), PartnerFilter.ANALYSIS_PERIOD_END_DATE);
    addToFilter(this.filter, this.searchForm.get('lastAnalysisDate'), PartnerFilter.LAST_ANALYSIS_DATE);
    addToFilter(this.filter, this.searchForm.get('showNotActive'), PartnerFilter.SHOW_NOT_ACTIVE);
  }

  previousState(): void {
    window.history.back();
  }

  protected onSuccess(data: IPartner[], headers: HttpHeaders): void {
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

  clearFields(...ctrlNames: string[]): void {
    ctrlNames.forEach(ctrlName => this.searchForm.get(ctrlName)?.setValue(null));
  }

  startFilter = (date: dayjs.Dayjs | null): boolean => {
    const endDate = this.searchForm.get('analysisEndDate')?.value || dayjs().add(5, 'year');

    return date ? date.isSameOrBefore(endDate) : true;
  };

  endFilter = (date: dayjs.Dayjs | null): boolean => {
    const startDate = this.searchForm.get('analysisStartDate')?.value || dayjs().add(-5, 'year');

    return date ? date.isSameOrAfter(startDate) : true;
  };

  navigate(url: string, data: any): void {
    this.locationHelper.data = data;
    this.router.navigateByUrl(url);
  }
}
