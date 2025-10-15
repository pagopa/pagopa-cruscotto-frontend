import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatCell, MatColumnDef, MatHeaderCell, MatHeaderRow, MatRow, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { KpiB1Result, OutcomeStatus } from '../models/KpiB1Result';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButton } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { KpiB1ResultService } from '../service/kpi-b1-result.service';

@Component({
  selector: 'jhi-kpi-b1-result-table',
  templateUrl: './kpi-b1-result-table.component.html',
  styleUrls: ['./kpi-b1-result-table.component.scss'],
  imports: [
    MatPaginator,
    MatTableModule,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    TranslateModule,
    NgIf,
    MatPaginatorModule,
    MatSortModule,
    NgxSpinnerModule,
    MatButton,
    FormatDatePipe,
    NgClass,
    DecimalPipe,
  ],
})
export class KpiB1ResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'analysisDate',
    'institutionCount',
    'transactionCount',
    'institutionTolerance',
    'transactionTolerance',
    'evaluationType',
    'outcome',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiB1Result>([]);
  locale: string;

  @Input() moduleId: number | undefined;

  // evento Output che emette l'ID per mostrare i dettagli
  @Output() showDetails = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }
  isLoadingResults = false;
  selectedElementId: number | null = null;
  protected readonly OutcomeStatus = OutcomeStatus;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly KpiB1ResultService = inject(KpiB1ResultService);
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
    if (this.moduleId) {
      this.fetchKpiB1Results(this.moduleId);
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
   * Recupera i risultati KPI B2 dall'API
   */
  fetchKpiB1Results(moduleId: number): void {
    this.spinner.show('isLoadingResultsKpiB1ResultTable').then(() => {
      this.isLoadingResults = true; // Indica che il caricamento è in corso

      this.KpiB1ResultService.getKpiResults(moduleId).subscribe({
        next: (data: KpiB1Result[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Metodo chiamato al successo della chiamata API
   */
  protected onSuccess(data: KpiB1Result[]): void {
    this.spinner.hide('isLoadingResultsKpiB1ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;
      if (this.paginator) {
        this.paginator.firstPage();
      }
    });
  }

  /**
   * Metodo chiamato in caso di errore nella chiamata API
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiB1ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = []; // Resetta i dati in caso di errore
      console.error('Errore durante il recupero dei risultati KPI B2');
    });
  }

  // Getter per verificare se ci sono dati
  get hasData(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
  }

  /**
   * Metodo per emettere l'ID della riga selezionata
   */
  emitShowDetails(KpiB1ResultId: number): void {
    if (this.selectedElementId === KpiB1ResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = KpiB1ResultId;
    }
    this.showDetails.emit(KpiB1ResultId);
  }
}
