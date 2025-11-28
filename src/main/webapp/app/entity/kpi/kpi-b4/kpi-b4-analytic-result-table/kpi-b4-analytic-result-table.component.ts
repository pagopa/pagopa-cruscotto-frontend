import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB4AnalyticDataService } from '../service/kpi-b4-analytic-data.service';
import { KpiB4AnalyticData } from '../models/KpiB4AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import dayjs from 'dayjs/esm';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';

@Component({
  selector: 'jhi-kpi-b4-analytic-result-table',
  templateUrl: './kpi-b4-analytic-result-table.component.html',
  styleUrls: ['./kpi-b4-analytic-result-table.component.scss'],
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
  ],
})
export class KpiB4AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['outcome', 'analysisDate', 'dataDate', 'totalGPD', 'totalCP', 'details'];
  dataSource = new MatTableDataSource<KpiB4AnalyticData>([]);

  @Input() kpiB4DetailResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
  selectedElementId?: number | null = null;
  private readonly translateService = inject(TranslateService);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB4AnalyticDataService = inject(KpiB4AnalyticDataService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiB4DetailResultId) {
      this.fetchKpiB4AnalyticData(this.kpiB4DetailResultId);
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
   * Fetch KPI B4 Analytic Data by kpiB4DetailResultId
   */
  fetchKpiB4AnalyticData(detailResultId: number): void {
    this.spinner.show('isLoadingResultsKpiB4AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiB4AnalyticDataService.findByDetailResultId(detailResultId).subscribe({
        next: (data: KpiB4AnalyticData[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiB4AnalyticData[]): void {
    this.spinner.hide('isLoadingResultsKpiB4AnalyticResultTable').then(() => {
      this.isLoadingResults = false;

      const sortedData = data.sort((a, b) => {
        const aTime = toTimestamp(a.dataDate);
        const bTime = toTimestamp(b.dataDate);
        return aTime - bTime; // dal più vecchio al più recente
      });

      this.dataSource.data = sortedData;

      if (this.paginator) {
        this.paginator.firstPage();
      }
    });
  }

  /**
   * Handle errors during data retrieval
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiB4AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Error retrieving KPI B4 Analytic Data');
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
        case 'dataDate':
          return compare(a.dataDate?.toISOString(), b.dataDate?.toISOString(), isAsc);
        case 'eventTimestamp':
          return compare(a.eventTimestamp?.toISOString(), b.eventTimestamp?.toISOString(), isAsc);
        case 'totalGPD':
          return compare(a.totalGPD, b.totalGPD, isAsc);
        case 'totalCP':
          return compare(a.totalCP, b.totalCP, isAsc);
        case 'kpiB4DetailResultId':
          return compare(a.kpiB4DetailResultId, b.kpiB4DetailResultId, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiB4DetailResult: number): void {
    this.showDetails.emit(kpiB4DetailResult);
    this.selectedElementId = kpiB4DetailResult ?? null;
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
