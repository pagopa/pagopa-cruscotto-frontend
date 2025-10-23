import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB3AnalyticDataService } from '../service/kpi-b3-analytic-data.service';
import { KpiB3AnalyticData } from '../models/KpiB3AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';

@Component({
  selector: 'jhi-kpi-b3-analytic-result-table',
  templateUrl: './kpi-b3-analytic-result-table.component.html',
  styleUrls: ['./kpi-b3-analytic-result-table.component.scss'],
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
  ],
})
export class KpiB3AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['analysisDate', 'eventTimestamp', 'stationFiscalCode', 'standInCount', 'details'];
  dataSource = new MatTableDataSource<KpiB3AnalyticData>([]);

  @Input() kpiB3DetailResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
  selectedElementId?: number | null = null;
  private readonly translateService = inject(TranslateService);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB3AnalyticDataService = inject(KpiB3AnalyticDataService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiB3DetailResultId) {
      this.fetchKpiB3AnalyticData(this.kpiB3DetailResultId);
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
   * Fetch KPI B3 Analytic Data by kpiB3DetailResultId
   */
  fetchKpiB3AnalyticData(detailResultId: number): void {
    this.spinner.show('isLoadingResultsKpiB3AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiB3AnalyticDataService.findByDetailResultId(detailResultId).subscribe({
        next: (data: KpiB3AnalyticData[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiB3AnalyticData[]): void {
    this.spinner.hide('isLoadingResultsKpiB3AnalyticResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiB3AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Error retrieving KPI B3 Analytic Data');
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
          return compare(a.id, b.id, isAsc);
        case 'instanceId':
          return compare(a.instanceId, b.instanceId, isAsc);
        case 'instanceModuleId':
          return compare(a.instanceModuleId, b.instanceModuleId, isAsc);
        case 'analysisDate':
          return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
        case 'stationFiscalCode':
          return compare(a.stationFiscalCode, b.stationFiscalCode, isAsc);
        case 'eventTimestamp':
          return compare(a.eventTimestamp?.toISOString(), b.eventTimestamp?.toISOString(), isAsc);
        case 'standInCount':
          return compare(a.standInCount, b.standInCount, isAsc);
        case 'kpiB3DetailResultId':
          return compare(a.kpiB3DetailResultId, b.kpiB3DetailResultId, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiB3DetailResult: number): void {
    this.showDetails.emit(kpiB3DetailResult);
    this.selectedElementId = kpiB3DetailResult ?? null;
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
