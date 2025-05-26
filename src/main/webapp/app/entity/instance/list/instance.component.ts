import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventManager } from '../../../core/util/event-manager.service';
import { LocaltionHelper } from '../../../core/location/location.helper';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addFilterToRequest, addToFilter, addValueToFilter, getFilterValue } from '../../../shared/pagination/filter-util.pagination';
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
import { InstanceService } from '../service/instance.service';
import { IInstance, InstanceStatus } from '../models/instance.model';
import { InstanceFilter } from './instance.filter';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { InstanceStateViewComponent } from '../shared/instance-state-view.component';
import { PartnerSelectComponent } from '../../partner/shared/partner-select/partner-select.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import dayjs from '../../../config/dayjs';
import { DATE_FORMAT_ISO } from 'app/config/input.constants';
import { datepickerRangeValidatorFn } from 'app/shared/util/validator-util';

@Component({
  selector: 'jhi-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.scss'],
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
    InstanceStateViewComponent,
    PartnerSelectComponent,
    MatSelectModule,
    MatDatepickerModule,
  ],
})
export class InstanceComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'instanceIdentification',
    'partner',
    'predictedDateAnalysis',
    'applicationDate',
    'assignedUser',
    'analysisPeriodStartDate',
    'analysisPeriodEndDate',
    'status',
    'lastAnalysisDate',
    'lastAnalysisOutcome',
    'action',
  ];

  data: IInstance[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  confirmSubscriber?: Subscription;

  searchForm;

  locale: string;

  status = InstanceStatus;
  instanceStatusValues: InstanceStatus[] = Object.values(InstanceStatus);

  protected readonly router = inject(Router);
  protected readonly filter = inject(InstanceFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly instanceService = inject(InstanceService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);
  private readonly confirmModalService = inject(ConfirmModalService);
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.searchForm = this.fb.group(
      {
        partner: [''],
        status: [''],
        predictedAnalysisStartDate: new FormControl<dayjs.Dayjs | null>(null),
        predictedAnalysisEndDate: new FormControl<dayjs.Dayjs | null>(null),
        analysisStartDate: new FormControl<dayjs.Dayjs | null>(null),
        analysisEndDate: new FormControl<dayjs.Dayjs | null>(null),
      },
      {
        validators: [
          datepickerRangeValidatorFn('predictedAnalysisStartDate', 'predictedAnalysisEndDate'),
          datepickerRangeValidatorFn('analysisStartDate', 'analysisEndDate'),
        ],
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
    const stringPredictedAnalysisStartDate = getFilterValue(this.filter, InstanceFilter.PREDICTED_ANALYSIS_START_DATE);
    const stringPredictedAnalysisEndDate = getFilterValue(this.filter, InstanceFilter.PREDICTED_ANALYSIS_END_DATE);
    const stringAnalysisStartDate = getFilterValue(this.filter, InstanceFilter.ANALYSIS_START_DATE);
    const stringAnalysisEndDate = getFilterValue(this.filter, InstanceFilter.ANALYSIS_END_DATE);
    this.searchForm.patchValue({
      partner: getFilterValue(this.filter, InstanceFilter.PARTNER),
      status: getFilterValue(this.filter, InstanceFilter.STATUS) || '',
      predictedAnalysisStartDate: stringPredictedAnalysisStartDate ? dayjs(stringPredictedAnalysisStartDate, DATE_FORMAT_ISO) : null,
      predictedAnalysisEndDate: stringPredictedAnalysisEndDate ? dayjs(stringPredictedAnalysisEndDate, DATE_FORMAT_ISO) : null,
      analysisStartDate: stringAnalysisStartDate ? dayjs(stringAnalysisStartDate, DATE_FORMAT_ISO) : null,
      analysisEndDate: stringAnalysisEndDate ? dayjs(stringAnalysisEndDate, DATE_FORMAT_ISO) : null,
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
    void this.router.navigate(['/entity/instances']);
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

    this.instanceService.query(params).subscribe({
      next: (res: HttpResponse<IInstance[]>) => {
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
    addFilterToRequest(this.filter, InstanceFilter.PARTNER, req);
    addFilterToRequest(this.filter, InstanceFilter.STATUS, req);
    addFilterToRequest(this.filter, InstanceFilter.PREDICTED_ANALYSIS_START_DATE, req);
    addFilterToRequest(this.filter, InstanceFilter.PREDICTED_ANALYSIS_END_DATE, req);
    addFilterToRequest(this.filter, InstanceFilter.ANALYSIS_START_DATE, req);
    addFilterToRequest(this.filter, InstanceFilter.ANALYSIS_END_DATE, req);
  }

  private populateFilter(): void {
    addToFilter(this.filter, this.searchForm.get('partner'), InstanceFilter.PARTNER);
    addToFilter(this.filter, this.searchForm.get('status'), InstanceFilter.STATUS);
    if (this.searchForm.get('predictedAnalysisStartDate')?.value) {
      addValueToFilter(
        this.filter,
        this.searchForm.get('predictedAnalysisStartDate')?.value?.format(DATE_FORMAT_ISO),
        InstanceFilter.PREDICTED_ANALYSIS_START_DATE,
      );
    }
    if (this.searchForm.get('predictedAnalysisEndDate')?.value) {
      addValueToFilter(
        this.filter,
        this.searchForm.get('predictedAnalysisEndDate')?.value?.format(DATE_FORMAT_ISO),
        InstanceFilter.PREDICTED_ANALYSIS_END_DATE,
      );
    }
    if (this.searchForm.get('analysisStartDate')?.value) {
      addValueToFilter(
        this.filter,
        this.searchForm.get('analysisStartDate')?.value?.format(DATE_FORMAT_ISO),
        InstanceFilter.ANALYSIS_START_DATE,
      );
    }
    if (this.searchForm.get('analysisEndDate')?.value) {
      addValueToFilter(
        this.filter,
        this.searchForm.get('analysisEndDate')?.value?.format(DATE_FORMAT_ISO),
        InstanceFilter.ANALYSIS_END_DATE,
      );
    }
  }

  clearFields(...ctrlNames: string[]): void {
    ctrlNames.forEach(ctrlName => this.searchForm.get(ctrlName)?.setValue(null));
  }

  previousState(): void {
    window.history.back();
  }

  delete(row: IInstance): void {
    this.selectedRowId = row.id;
    const confirmOptions = new ConfirmModalOptions('entity.delete.title', 'pagopaCruscottoApp.instance.delete.question', undefined, {
      id: row.instanceIdentification,
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
          this.instanceService.delete(row.id!).subscribe({
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

  protected onSuccess(data: IInstance[], headers: HttpHeaders): void {
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

  updateStatus(row: IInstance): void {
    this.selectedRowId = row.id;
    const confirmOptions = new ConfirmModalOptions(
      'entity.updateStatus.title',
      'pagopaCruscottoApp.instance.updateStatus.question',
      undefined,
      {
        id: row.instanceIdentification,
        status: this.translateService.instant(
          'pagopaCruscottoApp.instanceState.' + (row.status === InstanceStatus.Bozza ? InstanceStatus.Pianificata : InstanceStatus.Bozza),
          undefined,
        ),
      },
    );

    this.confirmSubscriber = this.confirmModalService
      .save({ width: '500px', hasBackdrop: true }, confirmOptions)
      .pipe(take(1))
      .subscribe((result: ModalResult) => {
        this.selectedRowId = null;
        if (result === ModalResult.CONFIRMED) {
          this.spinner.show('isLoadingResults').then(() => {
            this.isLoadingResults = true;
          });
          this.instanceService.updateStatus(row.id!).subscribe({
            next: () => {
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
}
