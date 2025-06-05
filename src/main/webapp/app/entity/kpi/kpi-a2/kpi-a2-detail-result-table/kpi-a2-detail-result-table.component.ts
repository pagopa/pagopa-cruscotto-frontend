import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { KpiA2DetailResult } from '../models/KpiA2DetailResult';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { KpiA2DetailResultService } from '../service/kpi-a2-detail-result.service';
import { CommonModule, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OutcomeStatus } from '../models/KpiA2Result';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';

@Component({
  selector: 'jhi-kpi-a2-detail-result-table',
  imports: [
    MatPaginator,
    TranslateModule,
    NgClass,
    MatTableModule,
    MatButtonModule,
    FormatDatePipe,
    MatSortModule,
    NgxSpinnerModule,
    CommonModule,
  ],
  templateUrl: './kpi-a2-detail-result-table.component.html',
  styleUrl: './kpi-a2-detail-result-table.component.scss',
})
export class KpiA2DetailResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'analysisDate',
    'totPayments',
    'totIncorrectPayments',
    'errorPercentage',
    'evaluationStartDate',
    'evaluationEndDate',
    'outcome',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiA2DetailResult>([]);

  @Input() kpiA2ResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  selectedElementId: number | null = null;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);
  private readonly kpiA2DetailResultService = inject(KpiA2DetailResultService);

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
    if (this.kpiA2ResultId) {
      this.fetchKpiA2DetailResults(this.kpiA2ResultId);
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
   * Fetch KPI A2 Detail Results by kpiA2ResultId
   */
  fetchKpiA2DetailResults(kpiA2ResultId: number): void {
    this.spinner.show('isLoadingResultsKpiA2DetailResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiA2DetailResultService.findByResultId(kpiA2ResultId).subscribe({
        next: (data: KpiA2DetailResult[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Called on successful data retrieval
   */
  protected onSuccess(data: KpiA2DetailResult[]): void {
    this.spinner.hide('isLoadingResultsKpiA2DetailResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiA2DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei dettagli KPI A2');
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
        case 'totPayments':
          return compare(a.totPayments, b.totPayments, isAsc);
        case 'totIncorrectPayments':
          return compare(a.totIncorrectPayments, b.totIncorrectPayments, isAsc);
        case 'errorPercentage':
          return compare(a.errorPercentage, b.errorPercentage, isAsc);
        case 'evaluationStartDate':
          return compare(a.evaluationStartDate?.toISOString(), b.evaluationStartDate?.toISOString(), isAsc);
        case 'evaluationEndDate':
          return compare(a.evaluationEndDate?.toISOString(), b.evaluationEndDate?.toISOString(), isAsc);
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
  emitShowDetails(kpiA2DetailResultId: number): void {
    if (this.selectedElementId === kpiA2DetailResultId) {
      // Deseleziona l'elemento se è già selezionato
      this.selectedElementId = null;
    } else {
      // Seleziona un nuovo elemento
      this.selectedElementId = kpiA2DetailResultId;
    }
    this.showDetails.emit(kpiA2DetailResultId);
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
