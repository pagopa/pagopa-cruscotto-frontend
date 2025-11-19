import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import { KpiC2AnalyticData, KpiC2AnalyticDrillDown } from '../models/kpi-c2-models';
import { KpiC2AnalyticDrillDownService } from '../service/kpi-c2-analytic-drilldown.service';
import { DecimalPipe, NgIf } from '@angular/common';
import FormatDatePipe from 'app/shared/date/format-date.pipe';

@Component({
  selector: 'jhi-kpi-c2-analytic-drilldown-table',
  templateUrl: './kpi-c2-analytic-drilldown-table.component.html',
  styleUrls: ['./kpi-c2-analytic-drilldown-table.component.scss'],
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgxSpinnerModule,
    TranslateModule,
    MatButtonModule,
    NgIf,
    FormatDatePipe,
    DecimalPipe,
  ],
})
export class KpiC2AnalyticDrilldownTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['analysisDate', 'institutionCf', 'numPayment', 'numNotification', 'percentNotification'];

  dataSource = new MatTableDataSource<KpiC2AnalyticDrillDown>([]);

  @Input() selectedKpiC2AnalyticDrilldownId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<KpiC2AnalyticData>();

  isLoadingResults = false;
  locale: string;
  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiC2AnalyticDrillDownService = inject(KpiC2AnalyticDrillDownService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.selectedKpiC2AnalyticDrilldownId) {
      this.fetchKpiC2AnalyticData(this.selectedKpiC2AnalyticDrilldownId);
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
   * Fetch KPI C2 Analytic Data by kpiC2DetailResultId
   */
  fetchKpiC2AnalyticData(selectedKpiC2AnalyticDrilldownId: number): void {
    this.spinner.show('isLoadingResultsKpiC2AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiC2AnalyticDrillDownService.find(selectedKpiC2AnalyticDrilldownId).subscribe({
        next: (data: KpiC2AnalyticDrillDown[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiC2AnalyticDrillDown[]): void {
    this.spinner.hide('isLoadingResultsKpiC2AnalyticResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiC2AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Error retrieving KPI C2 Analytic Data');
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
    //     case 'endHour':
    //       return compare(a.endHour?.toISOString(), b.endHour?.toISOString(), isAsc);
    //     case 'totalRequests':
    //       return compare(a.totalRequests, b.totalRequests, isAsc);
    //     case 'okRequests':
    //       return compare(a.okRequests, b.okRequests, isAsc);
    //     case 'averageTimeMs':
    //       return compare(a.averageTimeMs, b.averageTimeMs, isAsc);
    //     default:
    //       return 0;
    //   }
    // });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiC2DetailResultId: KpiC2AnalyticData): void {
    this.showDetails.emit(kpiC2DetailResultId);
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
