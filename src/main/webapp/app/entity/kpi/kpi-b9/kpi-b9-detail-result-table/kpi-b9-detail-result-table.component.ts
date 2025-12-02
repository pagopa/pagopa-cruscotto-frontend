import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EvaluationType, KpiB9DetailResult } from '../models/KpiB9DetailResult';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { KpiB9DetailResultService } from '../service/kpi-b9-detail-result.service';
import { CommonModule, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OutcomeStatus } from '../models/KpiB9Result';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { DecimalPipe } from '@angular/common';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

@Component({
  selector: 'jhi-kpi-b9-detail-result-table',
  imports: [
    TranslateModule,
    NgClass,
    MatTableModule,
    MatButtonModule,
    FormatDatePipe,
    MatSortModule,
    NgxSpinnerModule,
    CommonModule,
    DecimalPipe,
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
  templateUrl: './kpi-b9-detail-result-table.component.html',
  styleUrl: './kpi-b9-detail-result-table.component.scss',
})
export class KpiB9DetailResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'outcome',
    'evaluationStartDate',
    'evaluationEndDate',
    'totRes',
    'resKo',
    'resKoPercentage',
    'analysisDate',
    'evaluationType',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiB9DetailResult>([]);

  @Input() kpiB9ResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  selectedElementId: number | null = null;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);
  private readonly kpiB9DetailResultService = inject(KpiB9DetailResultService);
  protected readonly EvaluationType = EvaluationType;

  locale: string;

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });
  }

  ngOnChanges(): void {
    if (this.kpiB9ResultId) {
      this.fetchKpiB9DetailResults(this.kpiB9ResultId);
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
   * Fetch KPI B9 Detail Results by kpiB9ResultId
   */
  fetchKpiB9DetailResults(kpiB9ResultId: number): void {
    this.spinner.show('isLoadingResultsKpiB9DetailResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiB9DetailResultService.findByModuleId(kpiB9ResultId).subscribe({
        next: (data: KpiB9DetailResult[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Called on successful data retrieval
   */
  protected onSuccess(data: KpiB9DetailResult[]): void {
    this.spinner.hide('isLoadingResultsKpiB9DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;
      if (this.paginator) {
        this.paginator.firstPage();
      }
    });
  }

  /**
   * Called on error during data retrieval
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiB9DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei dettagli KPI B9');
    });
  }

  /**
   * Verifica se ci sono dati disponibili
   */
  get hasData(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
  }

  /** paginator creato nel jhi-table-header-bar */
  onHeaderPaginatorReady(p: MatPaginator) {
    this.paginator = p;
    this.dataSource.paginator = p;
  }

  /**
   * Gestisce il sorting lato client
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
        case 'analysisDate':
          return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
        case 'stationName':
          return compare(a.stationName, b.stationName, isAsc);
        case 'evaluationType':
          return compare(a.evaluationType, b.evaluationType, isAsc);
        case 'evaluationStartDate':
          return compare(a.evaluationStartDate?.toISOString(), b.evaluationStartDate?.toISOString(), isAsc);
        case 'evaluationEndDate':
          return compare(a.evaluationEndDate?.toISOString(), b.evaluationEndDate?.toISOString(), isAsc);
        case 'totRes':
          return compare(a.totRes, b.totRes, isAsc);
        case 'resKo':
          return compare(a.resKo, b.resKo, isAsc);
        case 'resKoPercentage':
          return compare(a.resKoPercentage, b.resKoPercentage, isAsc);
        case 'outcome':
          return compare(a.outcome, b.outcome, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Metodo per emettere l'ID della riga selezionata
   */
  emitShowDetails(kpiB9DetailResultId: number): void {
    if (this.selectedElementId === kpiB9DetailResultId) {
      // Deseleziona l'elemento se è già selezionato
      this.selectedElementId = null;
    } else {
      // Seleziona un nuovo elemento
      this.selectedElementId = kpiB9DetailResultId;
    }
    this.showDetails.emit(kpiB9DetailResultId);
  }

  protected readonly OutcomeStatus = OutcomeStatus;
}

/**
 * Funzione generica di confronto
 */
function compare(a: any, b: any, isAsc: boolean): number {
  if (a == null && b == null) return 0;
  if (a == null) return isAsc ? -1 : 1;
  if (b == null) return isAsc ? 1 : -1;
  return (a > b ? 1 : a < b ? -1 : 0) * (isAsc ? 1 : -1);
}
