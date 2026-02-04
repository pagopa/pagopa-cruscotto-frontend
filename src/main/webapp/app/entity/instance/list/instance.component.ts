import { Component, OnInit, OnDestroy, inject, computed, signal, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take, forkJoin, first, switchMap, map, catchError, of, timer } from 'rxjs';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventManager } from '../../../core/util/event-manager.service';
import { LocaltionHelper } from '../../../core/location/location.helper';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { InstanceService } from '../service/instance.service';
import { ReportService } from '../service/report.service';
import { IInstance, InstanceStatus } from '../models/instance.model';
import { InstanceFilter } from './instance.filter';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { InstanceStateViewComponent } from '../shared/instance-state-view.component';
import { PartnerSelectComponent } from '../../partner/shared/partner-select/partner-select.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import dayjs from '../../../config/dayjs';
import { datepickerRangeValidatorFn } from 'app/shared/util/validator-util';
import { OutcomeStatus } from '../../kpi/kpi-b2/models/KpiB2Result';
import { Authority } from 'app/config/authority.constants';
import { YesOrNoViewComponent } from '../../../shared/component/yes-or-no-view.component';
import { AccountService } from 'app/core/auth/account.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { GenerateReportRequest } from '../models/report.model';
import { ToastrService } from 'ngx-toastr';

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
    YesOrNoViewComponent,
    MatCheckboxModule,
  ],
})
export class InstanceComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'select',
    'instanceIdentification',
    'partnerFiscalCode',
    'partner',
    'predictedDateAnalysis',
    'applicationDate',
    'analysisPeriodStartDate',
    // 'analysisPeriodEndDate',
    'status',
    'lastAnalysisOutcome',
    'action',
  ];

  data: IInstance[] = [];
  selection = new SelectionModel<number>(true, []);
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  reportStatusMap = new Map<number, any>();
  reportStatusPolling?: Subscription;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  enableInstanceDeletion = false;
  confirmSubscriber?: Subscription;

  searchForm;

  locale: string;

  status = InstanceStatus;
  instanceStatusValues: InstanceStatus[] = Object.values(InstanceStatus);

  protected readonly Authority = Authority;

  protected readonly router = inject(Router);
  protected readonly filter = inject(InstanceFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly instanceService = inject(InstanceService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);
  private readonly confirmModalService = inject(ConfirmModalService);
  private readonly translateService = inject(TranslateService);
  private readonly accountService = inject(AccountService);
  private readonly reportService = inject(ReportService);
  private readonly toastrService = inject(ToastrService);

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

    if (this.locationHelper.data) {
      this.filter.filters = this.locationHelper.data;
    }

    this.enableInstanceDeletion = this.accountService.hasAnyAuthority(Authority.INSTANCE_FORCED_DELETION).valueOf();
  }

  ngOnInit(): void {
    this.updateForm();

    if (this.locationHelper.getIsBack() || this.locationHelper.data) {
      this.loadPage(this.filter.page, true);
      this.locationHelper.data = null;
    }

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  updateForm(): void {
    this.searchForm.patchValue({
      partner: getFilterValue(this.filter, InstanceFilter.PARTNER),
      status: getFilterValue(this.filter, InstanceFilter.STATUS),
      predictedAnalysisStartDate: getFilterValue(this.filter, InstanceFilter.PREDICTED_ANALYSIS_START_DATE),
      predictedAnalysisEndDate: getFilterValue(this.filter, InstanceFilter.PREDICTED_ANALYSIS_END_DATE),
      analysisStartDate: getFilterValue(this.filter, InstanceFilter.ANALYSIS_START_DATE),
      analysisEndDate: getFilterValue(this.filter, InstanceFilter.ANALYSIS_END_DATE),
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

        if (data.length > 0) {
          this.startReportStatusPolling(data);
        }
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
    if (this.reportStatusPolling) {
      this.reportStatusPolling.unsubscribe();
    }
  }

  private startReportStatusPolling(data: IInstance[]): void {
    if (this.reportStatusPolling) {
      this.reportStatusPolling.unsubscribe();
    }

    const instances = data.filter(d => d.latestCompletedReportId);
    if (instances.length === 0) {
      return;
    }

    this.reportStatusPolling = timer(0, 60000).subscribe(() => {
      instances.forEach(instance => {
        this.reportService
          .checkStatus(instance.latestCompletedReportId!)
          .pipe(
            first(),
            catchError(() => of(null)),
          )
          .subscribe(result => {
            if (result !== null) {
              this.reportStatusMap.set(instance.id!, result.body);
            }
          });
      });
    });
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
    addToFilter(this.filter, this.searchForm.get('predictedAnalysisStartDate'), InstanceFilter.PREDICTED_ANALYSIS_START_DATE);
    addToFilter(this.filter, this.searchForm.get('predictedAnalysisEndDate'), InstanceFilter.PREDICTED_ANALYSIS_END_DATE);
    addToFilter(this.filter, this.searchForm.get('analysisStartDate'), InstanceFilter.ANALYSIS_START_DATE);
    addToFilter(this.filter, this.searchForm.get('analysisEndDate'), InstanceFilter.ANALYSIS_END_DATE);
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

  launchReportGeneration() {
    const ids = this.selection.selected.map(el => el);
    const request: GenerateReportRequest = {
      instanceIds: ids,
      language: this.translateService.currentLang,
    };
    this.eventManager.broadcast({
      name: 'pagopaCruscottoApp.alert',
      content: { type: 'warning', translationKey: 'pagopaCruscottoApp.instance.reports.generating' },
    });
    this.reportService.generate(request).subscribe({
      next: () => {
        // Handle successful report generation
        this.toastrService.clear();
        this.eventManager.broadcast({
          name: 'pagopaCruscottoApp.alert',
          content: { type: 'success', translationKey: 'pagopaCruscottoApp.instance.reports.generated' },
        });
        this.loadPage(this.filter.page, false);
      },
      error: () => {
        this.toastrService.clear();
        this.eventManager.broadcast({
          name: 'pagopaCruscottoApp.alert',
          content: { type: 'error', translationKey: 'pagopaCruscottoApp.instance.reports.error' },
        });
      },
    });
  }

  reportStatusLabel(instanceId: number): string {
    const status = this.reportStatusMap.get(instanceId)?.status;
    switch (status) {
      case 'COMPLETED':
        return 'pagopaCruscottoApp.instance.reports.download';
      case 'PENDING':
        return 'pagopaCruscottoApp.instance.reports.pending';
      case 'IN_PROGRESS':
        return 'pagopaCruscottoApp.instance.reports.progress';
      case 'FAILED':
        return 'pagopaCruscottoApp.instance.reports.error';
      default:
        return 'pagopaCruscottoApp.instance.reports.notGenerated';
    }
  }

  reportStatus(instanceId: number): boolean {
    const status = this.reportStatusMap.get(instanceId);
    if (!status) return true;
    else return status.status !== 'COMPLETED';
  }

  downloadReport(instanceId: number): void {
    const downloadUrl = this.reportStatusMap.get(instanceId)?.downloadInfo.downloadUrl;

    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = '';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
  }

  onSelectPageClick(e: MatCheckboxChange): void {
    if (e.checked) {
      this.data.filter(row => row.status == 'ESEGUITA').forEach(row => this.selection.select(row.id));
    } else {
      this.data.filter(row => row.status == 'ESEGUITA').forEach(row => this.selection.deselect(row.id));
    }
  }

  checkPageSelected(): boolean {
    const selectableRows = this.data.filter(row => row.status == 'ESEGUITA').map(row => row.id);
    return selectableRows.every(id => this.selection.isSelected(id)) && selectableRows.length > 0;
  }

  startFilter = (date: dayjs.Dayjs | null): boolean => {
    const endDate = this.searchForm.get('analysisEndDate')?.value || dayjs().add(5, 'year');

    return date ? date.isSameOrBefore(endDate) : true;
  };

  endFilter = (date: dayjs.Dayjs | null): boolean => {
    const startDate = this.searchForm.get('analysisStartDate')?.value || dayjs().add(-5, 'year');

    return date ? date.isSameOrAfter(startDate) : true;
  };
  protected readonly OutcomeStatus = OutcomeStatus;
}
