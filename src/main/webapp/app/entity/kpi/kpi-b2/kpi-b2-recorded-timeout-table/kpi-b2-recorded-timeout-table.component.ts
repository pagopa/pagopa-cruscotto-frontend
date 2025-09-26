import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB2AnalyticData } from '../models/KpiB2AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiB2RecordedTimeout } from '../models/KpiB2RecordedTimeout';
import { KpiB2RecordedTimeoutService } from '../service/kpi-b2-recorded-timeout.service';

@Component({
  selector: 'jhi-kpi-b2-recorded-timeout-table',
  templateUrl: './kpi-b2-recorded-timeout-table.component.html',
  styleUrls: ['./kpi-b2-recorded-timeout-table.component.scss'],
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgxSpinnerModule,
    TranslateModule,
    NgIf,
    MatButtonModule,
    FormatDatePipe,
    DecimalPipe,
  ],
})
export class KpiB2RecordedTimeoutTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['fromHour', 'endHour', 'totalRequests', 'okRequests', 'averageTimeMs'];
  dataSource = new MatTableDataSource<KpiB2RecordedTimeout>([]);

  @Input() selectedKpiB2RecordedTimeoutId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<KpiB2AnalyticData>();

  isLoadingResults = false;
  locale: string;
  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB2RecordedTimeoutService = inject(KpiB2RecordedTimeoutService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.selectedKpiB2RecordedTimeoutId) {
      this.fetchKpiB2AnalyticData(this.selectedKpiB2RecordedTimeoutId);
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Fetch KPI B2 Analytic Data by kpiB2DetailResultId
   */
  fetchKpiB2AnalyticData(selectedKpiB2RecordedTimeoutId: number): void {
    this.spinner.show('isLoadingResultsKpiB2AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiB2RecordedTimeoutService.find(selectedKpiB2RecordedTimeoutId).subscribe({
        next: (data: KpiB2RecordedTimeout[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiB2RecordedTimeout[]): void {
    this.spinner.hide('isLoadingResultsKpiB2AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;
      if (this.paginator) {
        this.paginator.firstPage();
      }
    });
  }

  /**
   * Handle errors during data retrieval
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiB2AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Error retrieving KPI B2 Analytic Data');
    });
  }

  /**
   * Check if there is data available
   */
  get hasData(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
  }

  /**
   * Client-side sorting functionality
   */
  sortData(sort: Sort): void {
    const data = this.dataSource.data.slice();

    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fromHour':
          return compare(a.fromHour?.toISOString(), b.fromHour?.toISOString(), isAsc);
        case 'endHour':
          return compare(a.endHour?.toISOString(), b.endHour?.toISOString(), isAsc);
        case 'totalRequests':
          return compare(a.totalRequests, b.totalRequests, isAsc);
        case 'okRequests':
          return compare(a.okRequests, b.okRequests, isAsc);
        case 'averageTimeMs':
          return compare(a.averageTimeMs, b.averageTimeMs, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiB2DetailResultId: KpiB2AnalyticData): void {
    this.showDetails.emit(kpiB2DetailResultId);
  }
}

/**
 * Generic comparison function
 */
function compare(a: any, b: any, isAsc: boolean): number {
  if (a == null && b == null) return 0;
  if (a == null) return isAsc ? -1 : 1;
  if (b == null) return isAsc ? 1 : -1;
  return (a > b ? 1 : a < b ? -1 : 0) * (isAsc ? 1 : -1);
}
