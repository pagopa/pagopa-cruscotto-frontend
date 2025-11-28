import { Component, Input, Output, EventEmitter, inject, ViewChild, AfterViewInit, OnChanges, OnInit } from '@angular/core';
import { CommonModule, NgClass, DecimalPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import FormatDatePipe from 'app/shared/date/format-date.pipe';
import { YesOrNoViewComponent } from 'app/shared/component/yes-or-no-view.component';
import { KpiB3Result } from '../models/KpiB3Result';
import { KpiB3ResultService } from '../service/kpi-b3-result.service';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
}

@Component({
  selector: 'jhi-kpi-b3-result-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    TranslateModule,
    NgxSpinnerModule,
    FormatDatePipe,
    YesOrNoViewComponent,
    NgClass,
    DecimalPipe,
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
  templateUrl: './kpi-b3-result-table.component.html',
  styleUrl: './kpi-b3-result-table.component.scss',
})
export class KpiB3ResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'outcome',
    'analysisDate',
    'excludePlannedShutdown',
    'excludeUnplannedShutdown',
    'eligibilityThreshold',
    'evaluationType',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiB3Result>([]);
  locale: string;

  @Input() moduleId?: number;

  @Output() showDetails = new EventEmitter<number>();

  @ViewChild(MatSort) sort: MatSort | null = null;

  protected readonly OutcomeStatus = OutcomeStatus;

  isLoadingResults = false;
  selectedElementId: number | null = null;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB3ResultService = inject(KpiB3ResultService);
  private readonly translateService = inject(TranslateService);
  private headerPaginator?: MatPaginator;

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
      this.fetchKpiB3Results(this.moduleId);
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
   * Recupera i risultati KPI B2 dall'API
   */
  fetchKpiB3Results(moduleId: number): void {
    this.spinner.show('isLoadingResultsKpiB3ResultTable').then(() => {
      this.isLoadingResults = true; // Indica che il caricamento è in corso

      this.kpiB3ResultService.getKpiResults(moduleId).subscribe({
        next: (data: KpiB3Result[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Metodo chiamato al successo della chiamata API
   */
  protected onSuccess(data: KpiB3Result[]): void {
    this.spinner.hide('isLoadingResultsKpiB3ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;
      if (this.headerPaginator) {
        this.headerPaginator.firstPage();
      }
    });
  }

  /**
   * Metodo chiamato in caso di errore nella chiamata API
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiB3ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = []; // Resetta i dati in caso di errore
      console.error('Errore durante il recupero dei risultati KPI B3');
    });
  }

  // Getter per verificare se ci sono dati
  get hasData(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
  }

  /** paginator creato nel jhi-table-header-bar */
  onHeaderPaginatorReady(p: MatPaginator) {
    this.headerPaginator = p;
    this.dataSource.paginator = p;
  }

  /**
   * Gestisce il sorting dei dati lato frontend
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
          return compare(a.analysisDate ? a.analysisDate.toISOString() : null, b.analysisDate ? b.analysisDate.toISOString() : null, isAsc);
        case 'excludePlannedShutdown':
          return compare(a.excludePlannedShutdown, b.excludePlannedShutdown, isAsc);
        case 'excludeUnplannedShutdown':
          return compare(a.excludeUnplannedShutdown, b.excludeUnplannedShutdown, isAsc);
        case 'eligibilityThreshold':
          return compare(a.eligibilityThreshold, b.eligibilityThreshold, isAsc);
        case 'evaluationType':
          return compare(a.evaluationType, b.evaluationType, isAsc);
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
  emitShowDetails(kpiB3ResultId: number): void {
    if (this.selectedElementId === kpiB3ResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = kpiB3ResultId;
    }
    this.showDetails.emit(kpiB3ResultId);
  }
}

/**
 * Funzione generica di confronto per il sorting
 */
function compare(a: string | number | boolean | null | undefined, b: string | number | boolean | null | undefined, isAsc: boolean): number {
  if (a == null && b == null) return 0;
  if (a == null) return isAsc ? -1 : 1;
  if (b == null) return isAsc ? 1 : -1;

  return (a > b ? 1 : a < b ? -1 : 0) * (isAsc ? 1 : -1);
}
