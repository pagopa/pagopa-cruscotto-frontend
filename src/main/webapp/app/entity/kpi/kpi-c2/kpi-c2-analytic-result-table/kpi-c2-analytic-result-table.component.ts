import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiC2AnalyticData } from '../models/kpi-c2-models';
import { KpiC2AnalyticDataService } from '../service/kpi-c2-analytic-data.service';

@Component({
  selector: 'jhi-kpi-c2-analytic-result-table',
  templateUrl: './kpi-c2-analytic-result-table.component.html',
  styleUrls: ['./kpi-c2-analytic-result-table.component.scss'],
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
export class KpiC2AnalyticResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'analysisDate',
    'dataDate',
    'numInstitution',
    'numInstitutionSend',
    'perInstitutionSend',
    'numPayments',
    'numNotification',
    'perNotification',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiC2AnalyticData>([]);

  @Input() kpiC2DetailResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  locale: string;
  selectedElementId?: number | null = null;
  private readonly translateService = inject(TranslateService);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiC2AnalyticDataService = inject(KpiC2AnalyticDataService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiC2DetailResultId) {
      this.fetchKpiC2AnalyticData(this.kpiC2DetailResultId);
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
  fetchKpiC2AnalyticData(detailResultId: number): void {
    this.spinner.show('isLoadingResultsKpiC2AnalyticResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiC2AnalyticDataService.findByDetailResultId(detailResultId).subscribe({
        next: (data: KpiC2AnalyticData[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Handle successful data retrieval
   */
  protected onSuccess(data: KpiC2AnalyticData[]): void {
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
    //     case 'id':
    //       return compare(a.id, b.id, isAsc);
    //     case 'instanceId':
    //       return compare(a.instanceId, b.instanceId, isAsc);
    //     case 'instanceModuleId':
    //       return compare(a.instanceModuleId, b.instanceModuleId, isAsc);
    //     case 'analysisDate':
    //       return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
    //     case 'stationName':
    //       return compare(a.stationName, b.stationName, isAsc);
    //     case 'method':
    //       return compare(a.method, b.method, isAsc);
    //     case 'evaluationDate':
    //       return compare(a.evaluationDate?.toISOString(), b.evaluationDate?.toISOString(), isAsc);
    //     case 'totReq':
    //       return compare(a.totReq, b.totReq, isAsc);
    //     case 'reqOk':
    //       return compare(a.reqOk, b.reqOk, isAsc);
    //     case 'reqTimeout':
    //       return compare(a.reqTimeout, b.reqTimeout, isAsc);
    //     case 'avgTime':
    //       return compare(a.avgTime, b.avgTime, isAsc);
    //     case 'kpiC2DetailResultId':
    //       return compare(a.kpiC2DetailResultId, b.kpiC2DetailResultId, isAsc);
    //     default:
    //       return 0;
    //   }
    // });
  }

  /**
   * Emit selected module ID for more details
   */
  emitShowDetails(kpiC2DetailResult: number): void {
    this.showDetails.emit(kpiC2DetailResult);
    this.selectedElementId = kpiC2DetailResult ?? null;
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
