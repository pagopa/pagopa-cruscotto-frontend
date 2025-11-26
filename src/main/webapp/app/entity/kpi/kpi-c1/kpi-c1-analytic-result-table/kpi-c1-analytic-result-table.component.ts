import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiC1AnalyticDataService } from '../service/kpi-c1-analytic-data.service';
import { KpiC1AnalyticData } from '../models/KpiC1AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-kpi-c1-analytic-result-table',
  templateUrl: './kpi-c1-analytic-result-table.component.html',
  styleUrls: ['./kpi-c1-analytic-result-table.component.scss'],
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
export class KpiC1AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['analysisDate', 'dataDate', 'institutionCount', 'positionsCount', 'messagesCount', 'details'];
  dataSource = new MatTableDataSource<KpiC1AnalyticData>([]);

  @Input() kpiC1DetailResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
  selectedElementId?: number | null = null;
  private readonly translateService = inject(TranslateService);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiC1AnalyticDataService = inject(KpiC1AnalyticDataService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiC1DetailResultId) {
      this.fetchKpiC1AnalyticData(this.kpiC1DetailResultId);
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    // Ordina di default i dati per dataDate (dal più vecchio al più recente)
    if (this.dataSource.data?.length) {
      this.dataSource.data = this.dataSource.data.sort((a, b) => {
        const aTime = toTimestamp(a.dataDate);
        const bTime = toTimestamp(b.dataDate);
        return aTime - bTime; // crescente = dal più vecchio al più recente
      });
    }
  }

  /**
   * Fetch KPI C1 Analytic Data by kpiC1DetailResultId
   */
  fetchKpiC1AnalyticData(detailResultId: number): void {
    this.spinner.show('isLoadingResultsKpiC1AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiC1AnalyticDataService.findByDetailResultId(detailResultId).subscribe({
        next: (data: KpiC1AnalyticData[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  protected onSuccess(data: KpiC1AnalyticData[]): void {
    this.spinner.hide('isLoadingResultsKpiC1AnalyticResultTable').then(() => {
      this.isLoadingResults = false;

      const sortedData = data.sort((a, b) => {
        const aTime = toTimestamp(a.dataDate);
        const bTime = toTimestamp(b.dataDate);
        return aTime - bTime;
      });

      this.dataSource.data = sortedData;
      this.paginator?.firstPage();
    });
  }

  /**
   * Handle errors during data retrieval
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiC1AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Error retrieving KPI C1 Analytic Data');
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
        case 'stationId':
          return compare(a.stationId, b.stationId, isAsc);
        case 'instanceModuleId':
          return compare(a.instanceModuleId, b.instanceModuleId, isAsc);
        case 'analysisDate':
          return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
        case 'dataDate':
          return compare(a.dataDate?.toISOString(), b.dataDate?.toISOString(), isAsc);
        case 'institutionCount':
          return compare(a.institutionCount, b.institutionCount, isAsc);
        case 'positionsCount':
          return compare(a.positionsCount, b.positionsCount, isAsc);
        case 'messagesCount':
          return compare(a.messagesCount, b.messagesCount, isAsc);
        case 'kpiC1DetailResultId':
          return compare(a.kpiC1DetailResultId, b.kpiC1DetailResultId, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiC1DetailResult: number): void {
    this.showDetails.emit(kpiC1DetailResult);
    this.selectedElementId = kpiC1DetailResult ?? null;
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

function toTimestamp(value: any): number {
  if (!value) return 0;
  if (dayjs.isDayjs(value)) return value.valueOf();
  const d = dayjs(value);
  return d.isValid() ? d.valueOf() : 0;
}
