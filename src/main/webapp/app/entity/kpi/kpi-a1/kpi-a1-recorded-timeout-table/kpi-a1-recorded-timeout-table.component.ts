import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiA1RecordedTimeoutService } from '../service/kpi-a1-recorded-timeout.service';
import { KpiA1AnalyticData } from '../models/KpiA1AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiA1RecordedTimeout } from '../models/KpiA1RecordedTimeout';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

@Component({
  selector: 'jhi-kpi-a1-recorded-timeout-table',
  templateUrl: './kpi-a1-recorded-timeout-table.component.html',
  styleUrls: ['./kpi-a1-recorded-timeout-table.component.scss'],
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgxSpinnerModule,
    FormsModule,
    TranslateModule,
    MatSlideToggleModule,
    NgIf,
    NgClass,
    MatButtonModule,
    FormatDatePipe,
    DecimalPipe,
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
    MatBadgeModule,
  ],
})
export class KpiA1RecordedTimeoutTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['indicator', 'fromHour', 'toHour', 'totalRequests', 'okRequests', 'reqTimeout'];
  dataSource = new MatTableDataSource<KpiA1RecordedTimeout>([]);

  @Input() kpiA1analyticDataId: number | undefined;

  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<KpiA1AnalyticData>();

  isLoadingResults = false;
  showAllRows = false;

  locale: string;
  partnerFiscalCode: string = '';
  originalData: KpiA1RecordedTimeout[] = [];
  negativeCount = 0;

  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly route = inject(ActivatedRoute);
  private readonly kpiA1RecordedTimeoutService = inject(KpiA1RecordedTimeoutService);
  private headerPaginator?: MatPaginator;

  constructor() {
    this.locale = this.translateService.currentLang;
    this.route.data.pipe(takeUntilDestroyed()).subscribe(_ => (this.partnerFiscalCode = _.instance.partnerFiscalCode));
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiA1analyticDataId) {
      this.fetchKpiA1AnalyticData(this.kpiA1analyticDataId);
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
   * Fetch KPI A1 Analytic Data by kpiA1DetailResultId
   */
  fetchKpiA1AnalyticData(id: number): void {
    this.spinner.show('isLoadingResultsKpiA1AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiA1RecordedTimeoutService.find(id).subscribe({
        next: (data: KpiA1RecordedTimeout[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiA1RecordedTimeout[]): void {
    this.spinner.hide('isLoadingResultsKpiA1AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.originalData = data;
      this.dataSource.data = data.filter(d => (d.reqTimeout ?? 0) > 0);
      this.negativeCount = this.originalData.filter(d => (d.reqTimeout ?? 0) > 0).length;

      this.showAllRows = false;

      this.applyFilter();

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
    this.spinner.hide('isLoadingResultsKpiA1AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Error retrieving KPI A1 Analytic Data');
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
        case 'toHour':
          return compare(a.toHour?.toISOString(), b.toHour?.toISOString(), isAsc);
        case 'totalRequests':
          return compare(a.totalRequests, b.totalRequests, isAsc);
        case 'okRequests':
          return compare(a.okRequests, b.okRequests, isAsc);
        case 'reqTimeout':
          return compare(a.reqTimeout, b.reqTimeout, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiA1DetailResultId: KpiA1AnalyticData): void {
    this.showDetails.emit(kpiA1DetailResultId);
  }

  applyFilter(): void {
    if (this.showAllRows) {
      this.dataSource.data = this.originalData; // tutte
    } else {
      this.dataSource.data = this.originalData.filter(d => (d.reqTimeout ?? 0) > 0);
    }

    this.negativeCount = this.originalData.filter(d => (d.reqTimeout ?? 0) > 0).length;

    if (this.headerPaginator) {
      this.headerPaginator.firstPage();
    }
  }

  onToggleChanged(value: boolean) {
    this.showAllRows = value;
    this.applyFilter();
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
