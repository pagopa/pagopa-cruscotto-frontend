import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiA1RecordedTimeoutService } from '../service/kpi-a1-recorded-timeout.service';
import { KpiA1AnalyticData } from '../models/KpiA1AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiA1RecordedTimeout, KpiA1RecordedTimeoutRequest } from '../models/KpiA1RecordedTimeout';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'jhi-kpi-a1-recorded-timeout-table',
  templateUrl: './kpi-a1-recorded-timeout-table.component.html',
  styleUrls: ['./kpi-a1-recorded-timeout-table.component.scss'],
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
  ],
})
export class KpiA1RecordedTimeoutTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['startDate', 'endDate', 'totReq', 'reqOk', 'reqTimeout'];
  dataSource = new MatTableDataSource<KpiA1RecordedTimeout>([]);

  @Input() kpiA1RecordedTimeoutRequest: KpiA1AnalyticData | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<KpiA1AnalyticData>();

  isLoadingResults = false;
  locale: string;
  partnerFiscalCode: string = '';
  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly route = inject(ActivatedRoute);
  private readonly kpiA1RecordedTimeoutService = inject(KpiA1RecordedTimeoutService);

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
    if (this.kpiA1RecordedTimeoutRequest) {
      this.fetchKpiA1AnalyticData(this.kpiA1RecordedTimeoutRequest);
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
   * Fetch KPI A1 Analytic Data by kpiA1DetailResultId
   */
  fetchKpiA1AnalyticData(data: KpiA1AnalyticData): void {
    this.spinner.show('isLoadingResultsKpiA1AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      const req: KpiA1RecordedTimeoutRequest = {
        cfPartner: parseInt(this.partnerFiscalCode),
        station: data.stationName!,
        method: data.method!,
      };
      this.kpiA1RecordedTimeoutService.find(req).subscribe({
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
        case 'startDate':
          return compare(a.startDate?.toISOString(), b.startDate?.toISOString(), isAsc);
        case 'endDate':
          return compare(a.endDate?.toISOString(), b.endDate?.toISOString(), isAsc);
        case 'totReq':
          return compare(a.totReq, b.totReq, isAsc);
        case 'reqOk':
          return compare(a.reqOk, b.reqOk, isAsc);
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
