import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB5ResultService } from '../service/kpi-b5-result.service';
import { KpiB5Result, OutcomeStatus } from '../models/KpiB5Result';
import { AverageFormatPipe } from '../../../../shared/pipes/average-format.pipe';
import { MatButton } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';

@Component({
  selector: 'jhi-kpi-b5-result-table',
  templateUrl: './kpi-b5-result-table.component.html',
  styleUrls: ['./kpi-b5-result-table.component.scss'],
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
    DecimalPipe,
    DetailStatusMarkerComponent,
  ],
})
export class KpiB5ResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = ['outcome', 'analysisDate', 'eligibilityThreshold', 'tolerance', 'details'];

  dataSource = new MatTableDataSource<KpiB5Result>([]);

  @Input() moduleId: number | undefined;
  @Output() showDetails = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  selectedElementId: number | null = null;
  isLoadingResults = false;
  protected readonly OutcomeStatus = OutcomeStatus;
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB5ResultService = inject(KpiB5ResultService);

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
      this.fetchKpiB5Results(this.moduleId);
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
   * Recupera i risultati KPI B5 dall'API
   */
  fetchKpiB5Results(moduleId: number): void {
    this.spinner.show('isLoadingResultsKpiB5ResultTable').then(() => {
      this.isLoadingResults = true;

      this.kpiB5ResultService.getKpiB5Results(moduleId).subscribe({
        next: (data: KpiB5Result[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Callback per il successo della chiamata API
   */
  protected onSuccess(data: KpiB5Result[]): void {
    this.spinner.hide('isLoadingResultsKpiB5ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;

      if (this.paginator) {
        this.paginator.firstPage();
      }
    });
  }

  /**
   * Callback per l'errore della chiamata API
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiB5ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei risultati KPI B5');
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
          return compare(a.id, b.id, isAsc);
        case 'analysisDate':
          return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
        case 'eligibilityThreshold':
          return compare(a.eligibilityThreshold, b.eligibilityThreshold, isAsc);
        case 'tolerance':
          return compare(a.tolerance, b.tolerance, isAsc);
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
  emitShowDetails(kpiB5ResultId: number): void {
    if (this.selectedElementId === kpiB5ResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = kpiB5ResultId;
    }
    this.showDetails.emit(kpiB5ResultId);
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
