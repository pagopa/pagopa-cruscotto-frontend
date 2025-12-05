import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiA1DetailResult } from '../models/KpiA1DetailResult';
import { KpiA1DetailResultService } from '../service/kpi-a1-detail-result.service';
import { EvaluationType, OutcomeStatus } from '../models/KpiA1Result';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

@Component({
  selector: 'jhi-kpi-a1-detail-result-table',
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
    DecimalPipe,
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
  templateUrl: './kpi-a1-detail-result-table.component.html',
  styleUrl: './kpi-a1-detail-result-table.component.scss',
})
export class KpiA1DetailResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'negativeData',
    'evaluationStartDate',
    'evaluationEndDate',
    'totalRequests',
    'reqTimeout',
    'timeoutPercentage',
    'evaluationType',
    'outcome',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiA1DetailResult>([]);

  @Input() kpiA1ResultId: number | null = null;

  @ViewChild(MatSort) sort: MatSort | null = null;

  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  selectedElementId: number | null = null;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiA1DetailResultService = inject(KpiA1DetailResultService);
  private headerPaginator?: MatPaginator;

  locale: string;
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiA1ResultId) {
      this.fetchKpiA1DetailResults(this.kpiA1ResultId);
    }
  }

  ngAfterViewInit(): void {
    if (this.headerPaginator) {
      this.dataSource.paginator = this.headerPaginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Recupera i dati dei KPI A1 Detail Results
   */
  fetchKpiA1DetailResults(kpiA1ResultId: number): void {
    this.spinner.show('isLoadingResultsKpiA1DetailResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiA1DetailResultService.findByResultId(kpiA1ResultId).subscribe({
        next: (data: KpiA1DetailResult[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  protected onSuccess(data: KpiA1DetailResult[]): void {
    this.spinner.hide('isLoadingResultsKpiA1DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;
      if (this.headerPaginator) {
        this.headerPaginator.firstPage();
      }
    });
  }

  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiA1DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei dettagli KPI A1');
    });
  }

  get hasData(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
  }

  /** paginator creato nel jhi-table-header-bar */
  onHeaderPaginatorReady(p: MatPaginator) {
    this.headerPaginator = p;
    this.dataSource.paginator = p;
  }

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
        case 'analysisDate':
          return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
        case 'stationName':
          return compare(a.stationName, b.stationName, isAsc);
        case 'method':
          return compare(a.method, b.method, isAsc);
        case 'totalRequests':
          return compare(a.totReq, b.totReq, isAsc);
        case 'reqTimeout':
          return compare(a.reqTimeout, b.reqTimeout, isAsc);
        case 'timeoutPercentage':
          return compare(a.timeoutPercentage, b.timeoutPercentage, isAsc);
        case 'evaluationStartDate':
          return compare(a.evaluationStartDate?.toISOString(), b.evaluationStartDate?.toISOString(), isAsc);
        case 'evaluationEndDate':
          return compare(a.evaluationEndDate?.toISOString(), b.evaluationEndDate?.toISOString(), isAsc);
        case 'evaluationType':
          return compare(a.evaluationType, b.evaluationType, isAsc);
        case 'outcome':
          return compare(a.outcome, b.outcome, isAsc);
        default:
          return 0;
      }
    });
  }

  emitShowDetails(kpiA1DetailResultId: number): void {
    if (this.selectedElementId === kpiA1DetailResultId) {
      this.selectedElementId = null;
    } else {
      this.selectedElementId = kpiA1DetailResultId;
    }
    this.showDetails.emit(kpiA1DetailResultId);
  }

  protected readonly EvaluationType = EvaluationType;
  protected readonly OutcomeStatus = OutcomeStatus;
}

function compare(a: any, b: any, isAsc: boolean): number {
  if (a == null && b == null) return 0;
  if (a == null) return isAsc ? -1 : 1;
  if (b == null) return isAsc ? 1 : -1;
  return (a > b ? 1 : a < b ? -1 : 0) * (isAsc ? 1 : -1);
}
