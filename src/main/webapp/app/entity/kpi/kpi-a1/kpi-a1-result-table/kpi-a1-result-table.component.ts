import { AfterViewInit, Component, inject, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { KpiA1ResultService } from '../service/kpi-a1-result.service';
import { KpiA1Result } from '../models/KpiA1Result';

@Component({
  selector: 'jhi-kpi-a1-result-table',
  templateUrl: './kpi-a1-result-table.component.html',
  styleUrls: ['./kpi-a1-result-table.component.scss'],
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, NgxSpinnerModule, TranslateModule, NgIf],
})
export class KpiA1ResultTableComponent implements AfterViewInit, OnChanges {
  displayedColumns: string[] = [
    'id',
    'analysisDate',
    'excludePlannedShutdown',
    'excludeUnplannedShutdown',
    'eligibilityThreshold',
    'tollerance',
    'evaluationType',
    'outcome',
  ];

  dataSource = new MatTableDataSource<KpiA1Result>([]);

  @Input() moduleId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  isLoadingResults = false;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly kpiA1ResultService = inject(KpiA1ResultService);

  ngOnChanges(): void {
    if (this.moduleId) {
      this.fetchKpiA1Results(this.moduleId);
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
   * Recupera i risultati KPI A1 dall'API
   */
  fetchKpiA1Results(moduleId: number): void {
    this.spinner.show('isLoadingResultsKpiA1ResultTable').then(() => {
      this.isLoadingResults = true;

      this.kpiA1ResultService.getKpiA1Results(moduleId).subscribe({
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

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
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
        case 'tollerance':
          return compare(a.tollerance, b.tollerance, isAsc);
        case 'evaluationType':
          return compare(a.evaluationType, b.evaluationType, isAsc);
        case 'outcome':
          return compare(a.outcome, b.outcome, isAsc);
        default:
          return 0;
      }
    });
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
