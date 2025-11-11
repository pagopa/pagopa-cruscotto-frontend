import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatCell, MatColumnDef, MatHeaderCell, MatHeaderRow, MatRow, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { KpiC2ResultService } from '../service/kpi-c2-result.service';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButton } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { YesOrNoViewComponent } from '../../../../shared/component/yes-or-no-view.component';
import { KpiC2Result, OutcomeStatus } from '../models/kpi-c2-models';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgIf, NgClass, DecimalPipe } from '@angular/common';

@Component({
  selector: 'jhi-kpi-c2-result-table',
  templateUrl: './kpi-c2-result-table.component.html',
  styleUrls: ['./kpi-c2-result-table.component.scss'],
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
export class KpiC2ResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['analysisDate', 'eligibilityThreshold', 'tolerance', 'evaluationType', 'outcome', 'details'];
  dataSource = new MatTableDataSource<KpiC2Result>([]);
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
  private readonly kpiC2ResultService = inject(KpiC2ResultService);
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
      this.fetchKpiC2Results(this.moduleId);
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
   * Recupera i risultati KPI C2 dall'API
   */
  fetchKpiC2Results(moduleId: number): void {
    this.spinner.show('isLoadingResultsKpiC2ResultTable').then(() => {
      this.isLoadingResults = true; // Indica che il caricamento è in corso

      this.kpiC2ResultService.getKpiResults(moduleId).subscribe({
        next: (data: KpiC2Result[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Metodo chiamato al successo della chiamata API
   */
  protected onSuccess(data: KpiC2Result[]): void {
    this.spinner.hide('isLoadingResultsKpiC2ResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiC2ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = []; // Resetta i dati in caso di errore
      console.error('Errore durante il recupero dei risultati KPI C2');
    });
  }

  // Getter per verificare se ci sono dati
  get hasData(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
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

    // this.dataSource.data = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'id':
    //       return compare(a.id, b.id, isAsc);
    //     case 'analysisDate':
    //       return compare(a.analysisDate ? a.analysisDate.toISOString() : null, b.analysisDate ? b.analysisDate.toISOString() : null, isAsc);
    //     case 'excludePlannedShutdown':
    //       return compare(a.excludePlannedShutdown, b.excludePlannedShutdown, isAsc);
    //     case 'excludeUnplannedShutdown':
    //       return compare(a.excludeUnplannedShutdown, b.excludeUnplannedShutdown, isAsc);
    //     case 'eligibilityThreshold':
    //       return compare(a.eligibilityThreshold, b.eligibilityThreshold, isAsc);
    //     case 'tolerance':
    //       return compare(a.tolerance, b.tolerance, isAsc);
    //     case 'averageTimeLimit':
    //       return compare(a.averageTimeLimit, b.averageTimeLimit, isAsc);
    //     case 'evaluationType':
    //       return compare(a.evaluationType, b.evaluationType, isAsc);
    //     case 'outcome':
    //       return compare(a.outcome, b.outcome, isAsc);
    //     default:
    //       return 0;
    //   }
    // });
  }

  /**
   * Metodo per emettere l'ID della riga selezionata
   */
  emitShowDetails(kpiC2ResultId: number): void {
    if (this.selectedElementId === kpiC2ResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = kpiC2ResultId;
    }
    this.showDetails.emit(kpiC2ResultId);
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
