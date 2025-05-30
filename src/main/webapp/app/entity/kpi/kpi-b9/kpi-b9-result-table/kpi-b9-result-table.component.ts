import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB9ResultService } from '../service/kpi-b9-result.service';
import { KpiB9Result } from '../models/KpiB9Result';
import { AverageFormatPipe } from '../../../../shared/pipes/average-format.pipe';
import { MatButton } from '@angular/material/button';
import { OutcomeStatus } from '../models/KpiB9Result';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { BooleanTranslatePipe } from '../../../../shared/pipes/boolean-translate.pipe';

@Component({
  selector: 'jhi-kpi-b9-result-table',
  templateUrl: './kpi-b9-result-table.component.html',
  styleUrls: ['./kpi-b9-result-table.component.scss'],
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgxSpinnerModule,
    TranslateModule,
    NgIf,
    AverageFormatPipe,
    NgClass,
    MatButton,
    FormatDatePipe,
    BooleanTranslatePipe,
  ],
})
export class KpiB9ResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['analysisDate', 'excludePlanned', 'excludeUnplanned', 'tolerance', 'outcome', 'details'];

  dataSource = new MatTableDataSource<KpiB9Result>([]);

  @Input() moduleId: number | undefined;
  @Output() showDetails = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  selectedElementId: number | null = null;
  isLoadingResults = false;
  protected readonly OutcomeStatus = OutcomeStatus;
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB9ResultService = inject(KpiB9ResultService);

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
    if (this.moduleId) {
      this.fetchKpiB9Results(this.moduleId);
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
   * Recupera i risultati KPI B9 dall'API
   */
  fetchKpiB9Results(moduleId: number): void {
    this.spinner.show('isLoadingResultsKpiB9ResultTable').then(() => {
      this.isLoadingResults = true;

      this.kpiB9ResultService.getKpiB9Results(moduleId).subscribe({
        next: (data: KpiB9Result[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Callback per il successo della chiamata API
   */
  protected onSuccess(data: KpiB9Result[]): void {
    this.spinner.hide('isLoadingResultsKpiB9ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  /**
   * Callback per l'errore della chiamata API
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiB9ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei risultati KPI B9');
    });
  }

  /**
   * Getter per verificare se ci sono dati
   */
  get hasData(): boolean {
    return this.dataSource.data && this.dataSource.data.length > 0;
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
          return compare(a.coId, b.coId, isAsc);
        case 'analysisDate':
          return compare(a.dtAnalisysDate?.toISOString(), b.dtAnalisysDate?.toISOString(), isAsc);
        case 'excludePlanned':
          return compare(a.flExcludePlannedShutdown, b.flExcludePlannedShutdown, isAsc);
        case 'excludeUnplanned':
          return compare(a.flExcludeUnplannedShutdown, b.flExcludeUnplannedShutdown, isAsc);
        case 'tolerance':
          return compare(a.coTolerance, b.coTolerance, isAsc);
        case 'outcome':
          return compare(a.teOutcome, b.teOutcome, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Metodo per emettere l'ID della riga selezionata
   */
  emitShowDetails(kpiB9ResultId: number): void {
    if (this.selectedElementId === kpiB9ResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = kpiB9ResultId;
    }
    this.showDetails.emit(kpiB9ResultId);
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
