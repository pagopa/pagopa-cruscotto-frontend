import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiA1ResultService } from '../service/kpi-a1-result.service';
import { KpiA1Result } from '../models/KpiA1Result';
import { MatButton } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { OutcomeStatus } from '../../kpi-b2/models/KpiB2Result';
import { YesOrNoViewComponent } from '../../../../shared/component/yes-or-no-view.component';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

@Component({
  selector: 'jhi-kpi-a1-result-table',
  templateUrl: './kpi-a1-result-table.component.html',
  styleUrls: ['./kpi-a1-result-table.component.scss'],
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgxSpinnerModule,
    TranslateModule,
    NgIf,
    NgClass,
    MatButton,
    FormatDatePipe,
    YesOrNoViewComponent,
    DecimalPipe,
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
})
export class KpiA1ResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'analysisDate',
    'excludePlannedShutdown',
    'excludeUnplannedShutdown',
    'eligibilityThreshold',
    'tolerance',
    'evaluationType',
    'outcome',
    'details',
  ];

  dataSource = new MatTableDataSource<KpiA1Result>([]);

  @Input() moduleId: number | undefined;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @Output() showDetails = new EventEmitter<number>();

  private headerPaginator?: MatPaginator;

  isLoadingResults = false;
  selectedElementId: number | null = null;
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiA1ResultService = inject(KpiA1ResultService);

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
      this.fetchKpiA1Results(this.moduleId);
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
   * Recupera i risultati KPI A1 dall'API
   */
  fetchKpiA1Results(moduleId: number): void {
    this.spinner.show('isLoadingResultsKpiA1ResultTable').then(() => {
      this.isLoadingResults = true;

      this.kpiA1ResultService.getKpiResults(moduleId).subscribe({
        next: (data: KpiA1Result[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Callback per il successo della chiamata API
   */
  protected onSuccess(data: KpiA1Result[]): void {
    this.spinner.hide('isLoadingResultsKpiA1ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;
      if (this.headerPaginator) {
        this.headerPaginator.firstPage();
      }
    });
  }

  /**
   * Callback per l'errore della chiamata API
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiA1ResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei risultati KPI A1');
    });
  }

  /**
   * Getter per verificare se ci sono dati
   */
  get hasData(): boolean {
    return this.dataSource.data && this.dataSource.data.length > 0;
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
          return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
        case 'excludePlannedShutdown':
          return compare(a.excludePlannedShutdown, b.excludePlannedShutdown, isAsc);
        case 'excludeUnplannedShutdown':
          return compare(a.excludeUnplannedShutdown, b.excludeUnplannedShutdown, isAsc);
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
  emitShowDetails(kpiA1ResultId: number): void {
    if (this.selectedElementId === kpiA1ResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = kpiA1ResultId;
    }
    this.showDetails.emit(kpiA1ResultId);
  }

  protected readonly OutcomeStatus = OutcomeStatus;
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
