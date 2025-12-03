import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB9AnalyticDataService } from '../service/kpi-b9-analytic-data.service';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiB9AnalyticData } from '../models/KpiB9AnalyticData';

@Component({
  selector: 'jhi-kpi-b9-analytic-result-table',
  templateUrl: './kpi-b9-analytic-result-table.component.html',
  styleUrls: ['./kpi-b9-analytic-result-table.component.scss'],
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
export class KpiB9AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['outcome', 'evaluationDate', 'stationName', 'totRes', 'resOk', 'resKoReal', 'resKoValid', 'details'];
  dataSource = new MatTableDataSource<KpiB9AnalyticData>([]);

  @Input() kpiB9DetailResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  // @Output() showDetails = new EventEmitter<number>();
  @Output() showDetails = new EventEmitter<KpiB9AnalyticData>();

  isLoadingResults = false;
  locale: string;
  selectedElementId?: number | null = null;
  private readonly translateService = inject(TranslateService);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB9AnalyticDataService = inject(KpiB9AnalyticDataService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiB9DetailResultId) {
      this.fetchKpiB9AnalyticData(this.kpiB9DetailResultId);
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
   * Fetch KPI B9 Analytic Data by kpiB9DetailResultId
   */
  fetchKpiB9AnalyticData(detailResultId: number): void {
    this.spinner.show('isLoadingResultsKpiB9AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiB9AnalyticDataService.findByDetailResultId(detailResultId).subscribe({
        next: (data: KpiB9AnalyticData[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiB9AnalyticData[]): void {
    this.spinner.hide('isLoadingResultsKpiB9AnalyticResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiB9AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei dati analitici KPI B9');
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
    this.paginator = p;
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
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'stationName':
          return compare(a.stationName, b.stationName, isAsc);
        case 'analysisDate':
          return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
        case 'evaluationDate':
          return compare(a.evaluationDate?.toISOString(), b.evaluationDate?.toISOString(), isAsc);
        case 'totRes':
          return compare(a.totRes, b.totRes, isAsc);
        case 'resOk':
          return compare(a.resOk, b.resOk, isAsc);
        case 'resKoReal':
          return compare(a.resKoReal, b.resKoReal, isAsc);
        case 'resKoValid':
          return compare(a.resKoValid, b.resKoValid, isAsc);
        default:
          return 0;
      }
    });
  }

  onShowDetails(row: KpiB9AnalyticData) {
    console.log('[B9] click showDetails, id=', row);
    this.selectedElementId = row.id ?? null;
    this.showDetails.emit(row);
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
