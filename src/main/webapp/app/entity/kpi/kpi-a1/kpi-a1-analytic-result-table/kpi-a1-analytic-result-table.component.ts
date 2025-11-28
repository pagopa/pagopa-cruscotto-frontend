import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiA1AnalyticDataService } from '../service/kpi-a1-analytic-data.service';
import { KpiA1AnalyticData } from '../models/KpiA1AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

@Component({
  selector: 'jhi-kpi-a1-analytic-result-table',
  templateUrl: './kpi-a1-analytic-result-table.component.html',
  styleUrls: ['./kpi-a1-analytic-result-table.component.scss'],
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
    NgClass,
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
})
export class KpiA1AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'indicator',
    'evaluationDate',
    'stationName',
    'method',
    'totReq',
    'reqOk',
    'reqTimeoutReal',
    'reqTimeoutValid',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiA1AnalyticData>([]);

  @Input() kpiA1DetailResultId: number | undefined;

  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
  selectedElementId: number | null = null;
  private readonly translateService = inject(TranslateService);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiA1AnalyticDataService = inject(KpiA1AnalyticDataService);
  private headerPaginator?: MatPaginator;

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiA1DetailResultId) {
      this.fetchKpiA1AnalyticData(this.kpiA1DetailResultId);
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
  fetchKpiA1AnalyticData(detailResultId: number): void {
    this.spinner.show('isLoadingResultsKpiA1AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiA1AnalyticDataService.findByDetailResultId(detailResultId).subscribe({
        next: (data: KpiA1AnalyticData[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiA1AnalyticData[]): void {
    this.spinner.hide('isLoadingResultsKpiA1AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;
      if (this.headerPaginator) {
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
        case 'analysisDate':
          return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
        case 'stationName':
          return compare(a.stationName, b.stationName, isAsc);
        case 'method':
          return compare(a.method, b.method, isAsc);
        case 'evaluationDate':
          return compare(a.evaluationDate?.toISOString(), b.evaluationDate?.toISOString(), isAsc);
        case 'totReq':
          return compare(a.totReq, b.totReq, isAsc);
        case 'reqOk':
          return compare(a.reqOk, b.reqOk, isAsc);
        case 'reqTimeoutReal':
          return compare(a.reqTimeoutReal, b.reqTimeoutReal, isAsc);
        case 'reqTimeoutValid':
          return compare(a.reqTimeoutValid, b.reqTimeoutValid, isAsc);
        case 'kpiA1DetailResultId':
          return compare(a.kpiA1DetailResultId, b.kpiA1DetailResultId, isAsc);
        default:
          return 0;
      }
    });
  }

  emitShowDetails(kpiA1DetailResultId: number): void {
    if (this.selectedElementId === kpiA1DetailResultId) {
      this.selectedElementId = null;
    } else {
      this.selectedElementId = kpiA1DetailResultId;
    }
    this.showDetails.emit(kpiA1DetailResultId);
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
