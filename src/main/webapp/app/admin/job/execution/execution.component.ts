import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import SharedModule from '../../../shared/shared.module';
import { ITEMS_PER_PAGE } from '../../../config/pagination.constants';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
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
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ExecutionFilter } from './execution.filter';
import { MatSelectModule } from '@angular/material/select';
import dayjs from 'dayjs';
import { IJobExecution } from '../job.model';
import { JobService } from '../job.service';
import FormatDatePipe from '../../../shared/date/format-date.pipe';
import { addFilterToRequest, addValueToFilter } from '../../../shared/pagination/filter-util.pagination';
import { SafePipe } from '../../../shared/pipes/SafePipe';

@Component({
  selector: 'jhi-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.scss'],
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
    MatSelectModule,
    FormatDatePipe,
    SafePipe,
  ],
})
export class ExecutionComponent implements OnInit {
  displayedColumns: string[] = ['fireInstanceId', 'triggerGroup', 'triggerName', 'scheduledTime', 'initFiredTime', 'endFiredTime', 'state'];

  displayedColumnsWithExpand = [...this.displayedColumns, 'expand'];

  expandedElement: IJobExecution | null = null;

  data: IJobExecution[] = [];
  resultsLength = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;

  _search = false;
  isLoadingResults = false;
  selectedRowId: any;

  searchForm;

  locale: string;

  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly filter = inject(ExecutionFilter);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly jobService = inject(JobService);
  private readonly fb = inject(FormBuilder);
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.searchForm = this.fb.group({
      shutdownStartDate: new FormControl<dayjs.Dayjs | null>(null),
      shutdownEndDate: new FormControl<dayjs.Dayjs | null>(null),
    });

    this.route.queryParams.subscribe(params => {
      addValueToFilter(this.filter, params['schedulerName'], ExecutionFilter.SCHEDULER_NAME);
      addValueToFilter(this.filter, params['groupName'], ExecutionFilter.JOB_GROUP);
      addValueToFilter(this.filter, params['jobName'], ExecutionFilter.JOB_NAME);
    });

    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.updateForm();

    this.loadPage(this.filter.page, true);

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  updateForm(): void {
    this.searchForm.patchValue({
      // partner: getFilterValue(this.filter, ExecutionFilter.PARTNER),
      // typePlanned: getFilterValue(this.filter, ExecutionFilter.TYPE),
      // year: getFilterValue(this.filter, ExecutionFilter.YEAR),
      // shutdownStartDate: getFilterValue(this.filter, ExecutionFilter.SHUTDOWN_START_DATE),
      // shutdownEndDate: getFilterValue(this.filter, ExecutionFilter.SHUTDOWN_END_DATE),
    });
    this.page = this.filter.page;
  }

  search(): void {
    this.data = [];
    this.filter.clear();

    this.loadPage(1, true);
  }

  clear(): void {
    this.data = [];
    this.filter.clear();
    this.loadPage(1, true);
    void this.router.navigate(['/admin/jobs/execution']);
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

    this.jobService.execution(params).subscribe({
      next: (res: HttpResponse<IJobExecution[]>) => {
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
    addFilterToRequest(this.filter, ExecutionFilter.SCHEDULER_NAME, req);
    addFilterToRequest(this.filter, ExecutionFilter.JOB_GROUP, req);
    addFilterToRequest(this.filter, ExecutionFilter.JOB_NAME, req);
  }

  private populateFilter(): void {
    // addToFilter(this.filter, this.searchForm.get('partner'), ExecutionFilter.PARTNER);
    // addToFilter(this.filter, this.searchForm.get('typePlanned'), ExecutionFilter.TYPE);
    // addToFilter(this.filter, this.searchForm.get('year'), ExecutionFilter.YEAR);
    // addToFilter(this.filter, this.searchForm.get('shutdownStartDate'), ExecutionFilter.SHUTDOWN_START_DATE);
    // addToFilter(this.filter, this.searchForm.get('shutdownEndDate'), ExecutionFilter.SHUTDOWN_END_DATE);

    this.filter.page = this.page;
  }

  previousState(): void {
    window.history.back();
  }

  protected onSuccess(data: IJobExecution[], headers: HttpHeaders): void {
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

  isExpanded(element: IJobExecution) {
    return this.expandedElement === element;
  }

  toggle(element: IJobExecution) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }
}
