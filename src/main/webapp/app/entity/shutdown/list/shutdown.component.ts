import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, take } from 'rxjs';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EventManager } from '../../../core/util/event-manager.service';
import { LocaltionHelper } from '../../../core/location/location.helper';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { PartnerSelectComponent } from '../../partner/shared/partner-select/partner-select.component';
import { InstanceStatus } from 'app/entity/instance/models/instance.model';
import { ShutdownFilter } from './shutdown.filter';
import { ShutdownService } from 'app/entity/shutdown/service/shutdown.service';
import { IShutdown, TypePlanned } from '../shutdown.model';
import { MatSelectModule } from '@angular/material/select';
import dayjs from 'dayjs';
import {
  MatDatepickerToggle,
  MatDatepickerToggleIcon,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';

@Component({
  selector: 'jhi-shutdown',
  templateUrl: './shutdown.component.html',
  styleUrls: ['./shutdown.component.scss'],
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
    MatSelectModule,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    MatEndDate,
    MatStartDate,
  ],
})
export class ShutdownComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'shutdownIdentification',
    'typePlanned',
    'shutdownStartDate',
    'shutdownEndDate',
    'partnerFiscalCode',
    'partnerName',
    'stationName',
    'action',
  ];

  data: IShutdown[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  confirmSubscriber?: Subscription;

  searchForm;

  typePlannedValues: TypePlanned[] = Object.values(TypePlanned);

  locale: string;

  status = InstanceStatus;

  minDate = dayjs().startOf('year');

  maxDate = dayjs().endOf('year');

  year = dayjs().year();

  years: number[] = [this.year + 2, this.year + 1, this.year, this.year - 1, this.year - 2];

  protected readonly router = inject(Router);
  protected readonly filter = inject(ShutdownFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly eventManager = inject(EventManager);
  private readonly shutdownService = inject(ShutdownService);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly fb = inject(FormBuilder);
  private readonly confirmModalService = inject(ConfirmModalService);
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.searchForm = this.fb.group({
      partner: [''],
      typePlanned: [''],
      year: [null, [Validators.required]],
      shutdownStartDate: new FormControl<dayjs.Dayjs | null>(null),
      shutdownEndDate: new FormControl<dayjs.Dayjs | null>(null),
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
      partner: getFilterValue(this.filter, ShutdownFilter.PARTNER),
      typePlanned: getFilterValue(this.filter, ShutdownFilter.TYPE),
      year: getFilterValue(this.filter, ShutdownFilter.YEAR),
      shutdownStartDate: getFilterValue(this.filter, ShutdownFilter.SHUTDOWN_START_DATE),
      shutdownEndDate: getFilterValue(this.filter, ShutdownFilter.SHUTDOWN_END_DATE),
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
    this.year = dayjs().year();
    this.changeYear(this.year);
    void this.router.navigate(['/entity/shutdowns']);
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

    this.shutdownService.query(params).subscribe({
      next: (res: HttpResponse<IShutdown[]>) => {
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
    addFilterToRequest(this.filter, ShutdownFilter.PARTNER, req);
    addFilterToRequest(this.filter, ShutdownFilter.TYPE, req);
    addFilterToRequest(this.filter, ShutdownFilter.YEAR, req);
    addFilterToRequest(this.filter, ShutdownFilter.SHUTDOWN_START_DATE, req);
    addFilterToRequest(this.filter, ShutdownFilter.SHUTDOWN_END_DATE, req);
  }

  private populateFilter(): void {
    addToFilter(this.filter, this.searchForm.get('partner'), ShutdownFilter.PARTNER);
    addToFilter(this.filter, this.searchForm.get('typePlanned'), ShutdownFilter.TYPE);
    addToFilter(this.filter, this.searchForm.get('year'), ShutdownFilter.YEAR);
    addToFilter(this.filter, this.searchForm.get('shutdownStartDate'), ShutdownFilter.SHUTDOWN_START_DATE);
    addToFilter(this.filter, this.searchForm.get('shutdownEndDate'), ShutdownFilter.SHUTDOWN_END_DATE);

    this.filter.page = this.page;
  }

  previousState(): void {
    window.history.back();
  }

  clearFields(...ctrlNames: string[]): void {
    ctrlNames.forEach(ctrlName => this.searchForm.get(ctrlName)?.setValue(null));
  }

  delete(row: IShutdown): void {
    this.selectedRowId = row.id;
    const confirmOptions = new ConfirmModalOptions('entity.delete.title', 'pagopaCruscottoApp.shutdown.delete.question', undefined, {
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
          this.shutdownService.delete(row.id!).subscribe({
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
            error: error => {
              this.spinner.hide('isLoadingResults').then(() => {
                this.isLoadingResults = false;
              });
            },
          });
        }
      });
  }

  protected onSuccess(data: IShutdown[], headers: HttpHeaders): void {
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

  changeYear(year: number): void {
    this.minDate = dayjs().set('year', year).startOf('year');
    this.maxDate = dayjs().set('year', year).endOf('year');
  }
}
