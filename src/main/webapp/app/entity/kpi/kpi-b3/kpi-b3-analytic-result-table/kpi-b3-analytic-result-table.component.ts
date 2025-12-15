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
import dayjs from 'dayjs/esm';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

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
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
})
export class KpiB3AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['negativeData', 'analysisDate', 'eventTimestamp', 'stationFiscalCode', 'standInCount', 'details'];
  dataSource = new MatTableDataSource<KpiB3AnalyticData>([]);

  @Input() kpiB3DetailResultId: number | undefined;

  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
  selectedElementId?: number | null = null;

  private readonly translateService = inject(TranslateService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB3AnalyticDataService = inject(KpiB3AnalyticDataService);
  private headerPaginator?: MatPaginator;

  constructor() {
    this.locale = this.translateService.currentLang;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'analysisDate':
          return dayjs(item.analysisDate).valueOf();
        case 'eventTimestamp':
          return dayjs(item.eventTimestamp).valueOf();
        default:
          return (item as any)[property];
      }
    };
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
    if (this.headerPaginator) {
      this.dataSource.paginator = this.headerPaginator;
    }
    this.dataSource.sort = this.sort;
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

      setTimeout(() => {
        if (this.sort) {
          this.sort.active = 'eventTimestamp';
          this.sort.direction = 'asc';
          this.dataSource.sort = this.sort;
          this.sort.sortChange.emit({
            active: 'eventTimestamp',
            direction: 'asc',
          });
        }
      });
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

  /** paginator creato nel jhi-table-header-bar */
  onHeaderPaginatorReady(p: MatPaginator) {
    this.headerPaginator = p;
    this.dataSource.paginator = p;
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiB3DetailResult: number): void {
    this.showDetails.emit(kpiB3DetailResult);
    this.selectedElementId = kpiB3DetailResult ?? null;
  }
}
