import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB5DetailResultService } from '../service/kpi-b5-detail-result.service';
import { KpiB5DetailResult } from '../models/KpiB5DetailResult';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { OutcomeStatus } from '../models/KpiB5Result';

@Component({
  selector: 'jhi-kpi-b5-detail-result-table',
  templateUrl: './kpi-b5-detail-result-table.component.html',
  styleUrls: ['./kpi-b5-detail-result-table.component.scss'],
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
export class KpiB5DetailResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'analysisDate',
    'stationsPresent',
    'stationsWithoutSpontaneous',
    'percentageNoSpontaneous',
    'outcome',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiB5DetailResult>([]);

  @Input() kpiB5ResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  // evento Output che emette l'ID per mostrare i dettagli
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  selectedElementId: number | null = null;

  protected readonly OutcomeStatus = OutcomeStatus;
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB5DetailResultService = inject(KpiB5DetailResultService);

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
    if (this.kpiB5ResultId) {
      this.fetchKpiB5DetailResults(this.kpiB5ResultId);
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
   * Fetch Kpi B5 Detail Results by kpiB5ResultId
   */
  fetchKpiB5DetailResults(kpiB5ResultId: number): void {
    this.spinner.show('isLoadingResultsKpiB5DetailResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiB5DetailResultService.findByResultId(kpiB5ResultId).subscribe({
        next: (data: KpiB5DetailResult[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Called on successful data retrieval
   */
  protected onSuccess(data: KpiB5DetailResult[]): void {
    this.spinner.hide('isLoadingResultsKpiB5DetailResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiB5DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei dettagli KPI B5');
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
        case 'stationsPresent':
          return compare(a.stationsPresent, b.stationsPresent, isAsc);
        case 'stationsWithoutSpontaneous':
          return compare(a.stationsWithoutSpontaneous, b.stationsWithoutSpontaneous, isAsc);
        case 'percentageNoSpontaneous':
          return compare(a.percentageNoSpontaneous, b.percentageNoSpontaneous, isAsc);
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
  emitShowDetails(kpiB5DetailResultId: number): void {
    if (this.selectedElementId === kpiB5DetailResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = kpiB5DetailResultId;
    }
    this.showDetails.emit(kpiB5DetailResultId);
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