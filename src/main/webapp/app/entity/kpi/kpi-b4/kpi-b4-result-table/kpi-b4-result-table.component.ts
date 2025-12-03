import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatCell, MatColumnDef, MatHeaderCell, MatHeaderRow, MatRow, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { KpiB4ResultService } from '../service/kpi-b4-result.service';
import { KpiB4Result, OutcomeStatus } from '../models/KpiB4Result';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButton } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

@Component({
  selector: 'jhi-kpi-b4-result-table',
  standalone: true,
  templateUrl: './kpi-b4-result-table.component.html',
  styleUrls: ['./kpi-b4-result-table.component.scss'],
  imports: [
    CommonModule,
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
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
})
export class KpiB4ResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['outcome', 'analysisDate', 'eligibilityThreshold', 'tolerance', 'evaluationType', 'details'];
  dataSource = new MatTableDataSource<KpiB4Result>([]);
  locale: string;

  @Input() moduleId: number | undefined;

  // evento Output che emette l'ID per mostrare i dettagli
  @Output() showDetails = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  isLoadingResults = false;
  selectedElementId: number | null = null;
  protected readonly OutcomeStatus = OutcomeStatus;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB4ResultService = inject(KpiB4ResultService);
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
      this.fetchKpiB4Results(this.moduleId);
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
   * Recupera i risultati KPI B4 dall'API
   */
  fetchKpiB4Results(moduleId: number): void {
    this.spinner.show('isLoadingResultsKpiB4ResultTable').then(() => {
      this.isLoadingResults = true; // Indica che il caricamento è in corso

      this.kpiB4ResultService.getKpiResults(moduleId).subscribe({
        next: (data: KpiB4Result[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Metodo chiamato al successo della chiamata API
   */
  protected onSuccess(data: KpiB4Result[]): void {
    this.spinner.hide('isLoadingResultsKpiB4ResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiB4ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = []; // Resetta i dati in caso di errore
      console.error('Errore durante il recupero dei risultati KPI B4');
    });
  }

  // Getter per verificare se ci sono dati
  get hasData(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
  }

  /** paginator creato nel jhi-table-header-bar */
  onHeaderPaginatorReady(p: MatPaginator) {
    this.paginator = p;
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
        case 'eligibilityThreshold':
          return compare(a.eligibilityThreshold, b.eligibilityThreshold, isAsc);
        case 'tolerance':
          return compare(a.tolerance, b.tolerance, isAsc);
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
  emitShowDetails(kpiB4ResultId: number): void {
    if (this.selectedElementId === kpiB4ResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = kpiB4ResultId;
    }
    this.showDetails.emit(kpiB4ResultId);
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
