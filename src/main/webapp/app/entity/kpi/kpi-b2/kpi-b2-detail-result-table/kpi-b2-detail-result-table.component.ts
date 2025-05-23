import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiB2DetailResultService } from '../service/kpi-b2-detail-result.service';
import { KpiB2DetailResult } from '../models/KpiB2DetailResult';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'jhi-kpi-b2-detail-result-table',
  templateUrl: './kpi-b2-detail-result-table.component.html',
  styleUrls: ['./kpi-b2-detail-result-table.component.scss'],
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, NgxSpinnerModule, TranslateModule, NgIf, MatButtonModule],
})
export class KpiB2DetailResultTableComponent implements AfterViewInit, OnChanges {
  displayedColumns: string[] = [
    'id',
    'analysisDate',
    'stationId',
    'method',
    'totalRequests',
    'averageTime',
    'overTimeLimit',
    'evaluationStartDate',
    'evaluationEndDate',
    'evaluationType',
    'outcome',
    'details',
  ];
  dataSource = new MatTableDataSource<KpiB2DetailResult>([]);

  @Input() moduleId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  // evento Output che emette l'ID per mostrare i dettagli
  @Output() showDetails = new EventEmitter<number>();

  isLoadingResults = false;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiB2DetailResultService = inject(KpiB2DetailResultService);

  ngOnChanges(): void {
    if (this.moduleId) {
      this.fetchKpiB2DetailResults(this.moduleId);
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
   * Fetch Kpi B2 Detail Results by moduleId
   */
  fetchKpiB2DetailResults(moduleId: number): void {
    this.spinner.show('isLoadingResultsKpiB2DetailResultTable').then(() => {
      this.isLoadingResults = true;
      this.kpiB2DetailResultService.findByModuleId(moduleId).subscribe({
        next: (data: KpiB2DetailResult[]) => this.onSuccess(data),
        error: () => this.onError(),
      });
    });
  }

  /**
   * Called on successful data retrieval
   */
  protected onSuccess(data: KpiB2DetailResult[]): void {
    this.spinner.hide('isLoadingResultsKpiB2DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = data;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  /**
   * Called on error during data retrieval
   */
  protected onError(): void {
    this.spinner.hide('isLoadingResultsKpiB2DetailResultTable').then(() => {
      this.isLoadingResults = false;
      this.dataSource.data = [];
      console.error('Errore durante il recupero dei dettagli KPI B2');
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
        case 'stationId':
          return compare(a.stationId, b.stationId, isAsc);
        case 'method':
          return compare(a.method, b.method, isAsc);
        case 'totalRequests':
          return compare(a.totReq, b.totReq, isAsc);
        case 'averageTime':
          return compare(a.avgTime, b.avgTime, isAsc);
        case 'overTimeLimit':
          return compare(a.overTimeLimit, b.overTimeLimit, isAsc);
        case 'evaluationStartDate':
          return compare(a.evaluationStartDate?.toISOString(), b.evaluationStartDate?.toISOString(), isAsc);
        case 'evaluationEndDate':
          return compare(a.evaluationEndDate?.toISOString(), b.evaluationEndDate?.toISOString(), isAsc);
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
   * Metodo per emettere l'ID del modulo selezionato
   */
  emitShowDetails(moduleId: number): void {
    this.showDetails.emit(moduleId);
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
