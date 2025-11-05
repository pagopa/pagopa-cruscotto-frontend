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
export class KpiB6AnalyticResultTableComponent implements OnChanges, OnInit {
  displayedColumns: string[] = ['analysisDate', 'stationCode', 'paymentOption'];
  dataSource = new MatTableDataSource<KpiB6AnalyticData>([]);

  @Input() kpiB6DetailResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  @ViewChild(MatPaginator)
  set matPaginator(paginator: MatPaginator | null) {
    this.paginator = paginator;
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort)
  set matSort(sort: MatSort | null) {
    this.sort = sort;
    if (sort) {
      this.dataSource.sort = sort;
      this.sort!.active = 'analysisDate';
      this.sort!.direction = 'asc';
    }
  }

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

      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'analysisDate':
            return dayjs(item.analysisDate).valueOf();
          case 'paymentOption':
            return item.paymentOption?.toUpperCase() === 'SI' ? 1 : 0;
          default:
            return (item as any)[property];
        }
      };
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
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiB6DetailResult: number): void {
    this.showDetails.emit(kpiB6DetailResult);
    this.selectedElementId = kpiB6DetailResult ?? null;
  }
}
