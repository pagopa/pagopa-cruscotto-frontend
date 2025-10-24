import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB6DetailResultService } from '../service/kpi-b6-detail-result.service';
import { EvaluationType, KpiB6DetailResult } from '../models/KpiB6DetailResult';
import { MatButtonModule } from '@angular/material/button';
import FormatDatePipe from '../../../../shared/date/format-date.pipe';
import { OutcomeStatus } from '../models/KpiB6Result';

@Component({
  selector: 'jhi-kpi-b6-detail-result-table',
  templateUrl: './kpi-b6-detail-result-table.component.html',
  styleUrls: ['./kpi-b6-detail-result-table.component.scss'],
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
export class KpiB6DetailResultTableComponent implements AfterViewInit, OnChanges, OnInit {
  displayedColumns: string[] = [
    'id',
    'instanceId',
    'instanceModuleId',
    'anagStationId',
    'kpiB6ResultId',
    'analysisDate',
    'totalStations',
    'stationsWithPaymentOptions',
    'difference',
    'percentageDifference',
    'outcome',
  ];
  dataSource = new MatTableDataSource<KpiB6DetailResult>([]);

  @Input() kpiB6ResultId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  // evento Output che emette l'ID per mostrare i dettagli
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;
  selectedElementId: number | null = null;

  protected readonly OutcomeStatus = OutcomeStatus;
  protected readonly EvaluationType = EvaluationType;
  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB6DetailResultService = inject(KpiB6DetailResultService);

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
    if (this.kpiB6ResultId) {
      this.fetchKpiB6DetailResults(this.kpiB6ResultId);
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
   * Fetch Kpi B6 Detail Results by kpiB6ResultId
   */
  fetchKpiB6DetailResults(kpiB6ResultId: number): void {
    this.spinner.show('isLoadingResultsKpiB6DetailResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiB6DetailResultService.findByResultId(kpiB6ResultId).subscribe({
        next: (data: KpiB6DetailResult[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Called on successful data retrieval
   */
  protected onSuccess(data: KpiB6DetailResult[]): void {
    this.spinner.hide('isLoadingResultsKpiB6DetailResultTable').then(() => {
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
    this.spinner.hide('isLoadingResultsKpiB6DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei dettagli KPI B6');
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

    // this.dataSource.data = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'id':
    //       return compare(a.id, b.id, isAsc);
    //     case 'analysisDate':
    //       return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
    //     case 'evaluationType':
    //       return compare(a.evaluationType, b.evaluationType, isAsc);
    //     case 'evaluationStartDate':
    //       return compare(a.evaluationStartDate?.toISOString(), b.evaluationStartDate?.toISOString(), isAsc);
    //     case 'evaluationEndDate':
    //       return compare(a.evaluationEndDate?.toISOString(), b.evaluationEndDate?.toISOString(), isAsc);
    //     case 'totalGPD':
    //       return compare(a.totalGPD, b.totalGPD, isAsc);
    //     case 'totalCP':
    //       return compare(a.totalCP, b.totalCP, isAsc);
    //     case 'percentageCP':
    //       return compare(a.percentageCP, b.percentageCP, isAsc);
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
  emitShowDetails(kpiB6DetailResultId: number): void {
    if (this.selectedElementId === kpiB6DetailResultId) {
      // Se l'elemento è già selezionato, deseleziona
      this.selectedElementId = null;
    } else {
      // Altrimenti seleziona l'elemento
      this.selectedElementId = kpiB6DetailResultId;
    }
    this.showDetails.emit(kpiB6DetailResultId);
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
