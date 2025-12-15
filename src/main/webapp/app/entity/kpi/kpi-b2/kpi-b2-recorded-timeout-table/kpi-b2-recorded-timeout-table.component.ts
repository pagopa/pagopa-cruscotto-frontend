import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB2AnalyticData } from '../models/KpiB2AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiB2RecordedTimeout } from '../models/KpiB2RecordedTimeout';
import { KpiB2RecordedTimeoutService } from '../service/kpi-b2-recorded-timeout.service';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

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
    MatBadgeModule,
    NgIf,
    MatButtonModule,
    FormatDatePipe,
    DecimalPipe,
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
})
export class KpiB2RecordedTimeoutTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['negativeData', 'fromHour', 'endHour', 'totalRequests', 'okRequests', 'averageTimeMs'];
  dataSource = new MatTableDataSource<KpiB2RecordedTimeout>([]);

  @Input() selectedKpiB2RecordedTimeoutId: number | undefined;

  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<KpiB2AnalyticData>();

  isLoadingResults = false;
  showAllRows = false;
  isToggleDisabled = false;

  toggleLabel = '';

  private readonly TOGGLE_LABELS = {
    onlyNegative: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.onlyNegative',
    onlyPositive: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.onlyPositive',
    showNegative: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.showNegative',
    showAll: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.showAll',
  } as const;

  locale: string;
  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB2RecordedTimeoutService = inject(KpiB2RecordedTimeoutService);
  originalData: KpiB2RecordedTimeout[] = [];

  private headerPaginator?: MatPaginator;
  negativeCount = 0;

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
    if (this.headerPaginator) {
      this.dataSource.paginator = this.headerPaginator;
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
      this.originalData = data;
      const negatives = data.filter(d => (d.averageTimeMs ?? 0) > 2000);
      const positives = data.filter(d => (d.averageTimeMs ?? 0) <= 2000);

      this.negativeCount = negatives.length;

      this.updateToggleState(negatives.length, positives.length);

      this.dataSource.data = this.showAllRows ? data : negatives;

      if (this.headerPaginator) {
        this.dataSource.paginator = this.headerPaginator;
        this.headerPaginator.firstPage();
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

  /** paginator creato nel jhi-table-header-bar */
  onHeaderPaginatorReady(p: MatPaginator) {
    this.headerPaginator = p;
    this.dataSource.paginator = p;
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

  applyFilter(): void {
    if (this.showAllRows) {
      this.dataSource.data = this.originalData; // tutte
    } else {
      this.dataSource.data = this.originalData.filter(d => (d.averageTimeMs ?? 0) > 2000);
    }

    this.negativeCount = this.originalData.filter(d => (d.averageTimeMs ?? 0) > 2000).length;

    if (this.headerPaginator) {
      this.headerPaginator.firstPage();
    }
  }

  onToggleChanged(value: boolean) {
    this.showAllRows = value;
    this.applyFilter();
    this.updateLabelAfterToggle(value);
  }

  private updateToggleState(negatives: number, positives: number): void {
    /** case 1: solo negativi */
    if (negatives > 0 && positives === 0) {
      this.showAllRows = false;
      this.isToggleDisabled = true;
      this.toggleLabel = this.TOGGLE_LABELS.onlyNegative;
      return;
    }

    /** case 2: solo positivi */
    if (positives > 0 && negatives === 0) {
      this.showAllRows = true;
      this.isToggleDisabled = true;
      this.toggleLabel = this.TOGGLE_LABELS.onlyPositive;
      return;
    }

    /** case 3: mix */
    this.showAllRows = false;
    this.isToggleDisabled = false;
    this.toggleLabel = this.TOGGLE_LABELS.showNegative;
  }

  private updateLabelAfterToggle(value: boolean): void {
    this.toggleLabel = value ? this.TOGGLE_LABELS.showAll : this.TOGGLE_LABELS.showNegative;
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
