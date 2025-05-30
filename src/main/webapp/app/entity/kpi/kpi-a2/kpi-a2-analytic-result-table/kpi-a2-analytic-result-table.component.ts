import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiA2AnalyticDataService } from '../service/kpi-a2-analytic-data.service';
import { KpiA2AnalyticData } from '../models/KpiA2AnalyticData';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';

@Component({
  selector: 'jhi-kpi-a2-analytic-result-table',
  templateUrl: './kpi-a2-analytic-result-table.component.html',
  styleUrls: ['./kpi-a2-analytic-result-table.component.scss'],
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, NgxSpinnerModule, TranslateModule, NgIf, MatButtonModule, FormatDatePipe],
})
export class KpiA2AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['analysisDate', 'evaluationDate', 'totPayments', 'totIncorrectPayments'];
  dataSource = new MatTableDataSource<KpiA2AnalyticData>([]);

  @Input() kpiA2DetailResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
  private readonly translateService = inject(TranslateService);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiA2AnalyticDataService = inject(KpiA2AnalyticDataService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiA2DetailResultId) {
      this.fetchKpiA2AnalyticData(this.kpiA2DetailResultId);
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
   * Fetch KPI A2 Analytic Data by kpiA2DetailResultId
   */
  fetchKpiA2AnalyticData(detailResultId: number): void {
    this.spinner.show('isLoadingResultsKpiA2AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiA2AnalyticDataService.findByDetailResultId(detailResultId).subscribe({
        next: (data: KpiA2AnalyticData[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiA2AnalyticData[]): void {
    this.spinner.hide('isLoadingResultsKpiA2AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  /**
   * Handle errors during data retrieval
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiA2AnalyticResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Error retrieving KPI A2 Analytic Data');
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
        case 'evaluationDate':
          return compare(a.evaluationDate?.toISOString(), b.evaluationDate?.toISOString(), isAsc);
        case 'totPayments':
          return compare(a.totPayments, b.totPayments, isAsc);
        case 'totIncorrectPayments':
          return compare(a.totIncorrectPayments, b.totIncorrectPayments, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiA2DetailResultId: number): void {
    this.showDetails.emit(kpiA2DetailResultId);
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
