import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiC1DetailResultService } from '../service/kpi-c1-detail-result.service';
import { EvaluationType, KpiC1DetailResult } from '../models/KpiC1DetailResult';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { OutcomeStatus } from '../models/KpiC1Result';

@Component({
  selector: 'jhi-kpi-c1-detail-result-table',
  templateUrl: './kpi-c1-detail-result-table.component.html',
  styleUrls: ['./kpi-c1-detail-result-table.component.scss'],
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
  ],
})
export class KpiC1DetailResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'analysisDate',
    'evaluationType',
    'evaluationStartDate',
    'evaluationEndDate',
    'totalInstitutions',
    'okTotalInstitutions',
    'percentageOkInstitutions',
    'outcome',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiC1DetailResult>([]);

  @Input() kpiC1ResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  // evento Output che emette l'ID per mostrare i dettagli
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  selectedElementId: number | null = null;

  protected readonly OutcomeStatus = OutcomeStatus;
  protected readonly EvaluationType = EvaluationType;
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiC1DetailResultService = inject(KpiC1DetailResultService);

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
    if (this.kpiC1ResultId) {
      this.fetchKpiC1DetailResults(this.kpiC1ResultId);
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
   * Fetch Kpi C1 Detail Results by kpiC1ResultId
   */
  fetchKpiC1DetailResults(kpiC1ResultId: number): void {
    this.spinner.show('isLoadingResultsKpiC1DetailResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiC1DetailResultService.findByResultId(kpiC1ResultId).subscribe({
        next: (data: KpiC1DetailResult[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Called on successful data retrieval
   */
  protected onSuccess(data: KpiC1DetailResult[]): void {
    this.spinner.hide('isLoadingResultsKpiC1DetailResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiC1DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei dettagli KPI C1');
    });
  }

  /**
   * Verifica se ci sono dati disponibili
   */
  get hasData(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
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
        case 'evaluationType':
          return compare(a.evaluationType, b.evaluationType, isAsc);
        case 'evaluationStartDate':
          return compare(a.evaluationStartDate?.toISOString(), b.evaluationStartDate?.toISOString(), isAsc);
        case 'evaluationEndDate':
          return compare(a.evaluationEndDate?.toISOString(), b.evaluationEndDate?.toISOString(), isAsc);
        case 'totalInstitutions':
          return compare(a.totalInstitutions, b.totalInstitutions, isAsc);
        case 'okTotalInstitutions':
          return compare(a.okTotalInstitutions, b.okTotalInstitutions, isAsc);
        case 'percentageOkInstitutions':
          return compare(a.percentageOkInstitutions, b.percentageOkInstitutions, isAsc);
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
  emitShowDetails(kpiC1DetailResultId: number): void {
    if (this.selectedElementId === kpiC1DetailResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = kpiC1DetailResultId;
    }
    this.showDetails.emit(kpiC1DetailResultId);
  }
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