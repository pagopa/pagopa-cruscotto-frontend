import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiB1AnalyticDrilldown } from '../models/KpiB1AnalyticDrilldown';
import { KpiB1AnalyticDrilldownService } from '../service/kpi-b1-analytic-drilldown.service';

@Component({
  selector: 'jhi-kpi-b1-analytic-drilldown-table',
  templateUrl: './kpi-b1-analytic-drilldown-table.component.html',
  styleUrls: ['./kpi-b1-analytic-drilldown-table.component.scss'],
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, NgxSpinnerModule, TranslateModule, NgIf, MatButtonModule, FormatDatePipe],
})
export class KpiB1AnalyticDrilldownTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['dataDate', 'stationCode', 'institutionFiscalCode', 'transactionCount'];
  dataSource = new MatTableDataSource<KpiB1AnalyticDrilldown>([]);

  @Input() kpiB1analyticDataId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly KpiB1AnalyticDrilldownService = inject(KpiB1AnalyticDrilldownService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiB1analyticDataId) {
      this.fetchKpiB1AnalyticData(this.kpiB1analyticDataId);
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
   * Fetch KPI B1 Analytic Data by kpiB1DetailResultId
   */
  fetchKpiB1AnalyticData(kpiB1analyticDataId: number): void {
    this.spinner.show('isLoadingResultsKpiB1AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.KpiB1AnalyticDrilldownService.find(kpiB1analyticDataId).subscribe({
        next: (data: KpiB1AnalyticDrilldown[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiB1AnalyticDrilldown[]): void {
    this.spinner.hide('isLoadingResultsKpiB1AnalyticResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiB1AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Error retrieving KPI B1 Analytic Data');
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
    //     case 'fromHour':
    //       return compare(a.fromHour?.toISOString(), b.fromHour?.toISOString(), isAsc);
    //     default:
    //       return 0;
    //   }
    // });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiB1DetailResultId: number): void {
    this.showDetails.emit(kpiB1DetailResultId);
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
