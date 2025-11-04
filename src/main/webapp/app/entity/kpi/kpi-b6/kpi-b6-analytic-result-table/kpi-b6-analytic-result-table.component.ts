import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB6AnalyticDataService } from '../service/kpi-b6-analytic-data.service';
import { KpiB6AnalyticData } from '../models/KpiB6AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-kpi-b6-analytic-result-table',
  templateUrl: './kpi-b6-analytic-result-table.component.html',
  styleUrls: ['./kpi-b6-analytic-result-table.component.scss'],
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgxSpinnerModule,
    TranslateModule,
    NgIf,
    MatButtonModule,
    FormatDatePipe,
    NgClass,
  ],
})
export class KpiB6AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['analysisDate', 'stationCode', 'paymentOption'];
  dataSource = new MatTableDataSource<KpiB6AnalyticData>([]);

  @Input() kpiB6DetailResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
  selectedElementId?: number | null = null;
  private readonly translateService = inject(TranslateService);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB6AnalyticDataService = inject(KpiB6AnalyticDataService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiB6DetailResultId) {
      this.fetchKpiB6AnalyticData(this.kpiB6DetailResultId);
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
   * Fetch KPI B6 Analytic Data by kpiB6DetailResultId
   */
  fetchKpiB6AnalyticData(detailResultId: number): void {
    this.spinner.show('isLoadingResultsKpiB6AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiB6AnalyticDataService.findByDetailResultId(detailResultId).subscribe({
        next: (data: KpiB6AnalyticData[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiB6AnalyticData[]): void {
    this.spinner.hide('isLoadingResultsKpiB6AnalyticResultTable').then(() => {
      this.isLoadingResults = false;

      this.dataSource.data = data;

      if (this.sort) this.dataSource.sort = this.sort;
      if (this.paginator) this.dataSource.paginator = this.paginator;

      // if (this.paginator) {
      //   this.paginator.firstPage();
      // }
    });
  }

  /**
   * Handle errors during data retrieval
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiB6AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Error retrieving KPI B6 Analytic Data');
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

    // this.dataSource.data = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'id':
    //       return compare(a.id, b.id, isAsc);
    //     case 'instanceId':
    //       return compare(a.instanceId, b.instanceId, isAsc);
    //     case 'instanceModuleId':
    //       return compare(a.instanceModuleId, b.instanceModuleId, isAsc);
    //     case 'analysisDate':
    //       return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
    //     case 'dataDate':
    //       return compare(a.dataDate?.toISOString(), b.dataDate?.toISOString(), isAsc);
    //     case 'eventTimestamp':
    //       return compare(a.eventTimestamp?.toISOString(), b.eventTimestamp?.toISOString(), isAsc);
    //     case 'totalGPD':
    //       return compare(a.totalGPD, b.totalGPD, isAsc);
    //     case 'totalCP':
    //       return compare(a.totalCP, b.totalCP, isAsc);
    //     case 'kpiB6DetailResultId':
    //       return compare(a.kpiB6DetailResultId, b.kpiB6DetailResultId, isAsc);
    //     default:
    //       return 0;
    //   }
    // });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiB6DetailResult: number): void {
    this.showDetails.emit(kpiB6DetailResult);
    this.selectedElementId = kpiB6DetailResult ?? null;
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
