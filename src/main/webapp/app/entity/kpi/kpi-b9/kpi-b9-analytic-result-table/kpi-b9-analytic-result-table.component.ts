import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB9AnalyticDataService } from '../service/kpi-b9-analytic-data.service';

import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiB9AnalyticData } from '../models/KpiB9AnalyticData';

@Component({
  selector: 'jhi-kpi-b9-analytic-result-table',
  templateUrl: './kpi-b9-analytic-result-table.component.html',
  styleUrls: ['./kpi-b9-analytic-result-table.component.scss'],
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, NgxSpinnerModule, TranslateModule, NgIf, MatButtonModule, FormatDatePipe],
})
export class KpiB9AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['analysisDate', 'stationId', 'evaluationDate', 'totRes', 'resOk', 'resKoReal', 'resKoValid'];
  dataSource = new MatTableDataSource<KpiB9AnalyticData>([]);

  @Input() kpiB9DetailResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
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
          return compare(a.coId, b.coId, isAsc);
        case 'stationId':
          return compare(a.coStationId, b.coStationId, isAsc);
        case 'analysisDate':
          return compare(a.dtAnalisysDate?.toISOString(), b.dtAnalisysDate?.toISOString(), isAsc);
        case 'evaluationDate':
          return compare(a.dtEvaluationDate?.toISOString(), b.dtEvaluationDate?.toISOString(), isAsc);
        case 'totRes':
          return compare(a.coTotRes, b.coTotRes, isAsc);
        case 'resOk':
          return compare(a.coResOk, b.coResOk, isAsc);
        case 'resKoReal':
          return compare(a.coResKoReal, b.coResKoReal, isAsc);
        case 'resKoValid':
          return compare(a.coResKoValid, b.coResKoValid, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Emit selected detail ID for more details
   */
  emitShowDetails(kpiB9DetailResultId: number): void {
    this.showDetails.emit(kpiB9DetailResultId);
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
