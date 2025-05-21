import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { KpiB2ResultService } from '../service/kpi-b2-result.service';
import { KpiB2Result } from '../models/KpiB2Result';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'jhi-kpi-b2-result-table',
  templateUrl: './kpi-b2-result-table.component.html',
  styleUrls: ['./kpi-b2-result-table.component.scss'],
  imports: [
    MatPaginator,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    TranslateModule,
    MatTableModule,
    NgIf,
    MatPaginatorModule,
  ],
})
export class KpiB2ResultTableComponent implements OnInit, AfterViewInit, OnChanges {
  displayedColumns: string[] = [
    'id',
    'instanceId',
    'instanceModuleId',
    'analysisDate',
    'excludePlannedShutdown',
    'excludeUnplannedShutdown',
    'eligibilityThreshold',
    'tollerance',
    'averageTimeLimit',
    'evaluationType',
    'outcome',
  ];
  dataSource = new MatTableDataSource<KpiB2Result>([]);

  @Input() moduleId: number | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private kpiB2ResultService: KpiB2ResultService) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<KpiB2Result>([]);

    if (this.moduleId) {
      this.fetchKpiB2Results(this.moduleId); // Chiamata API
    } else {
      console.warn('moduleId non è disponibile in OnInit');
    }
  }

  ngOnChanges(): void {
    if (this.moduleId) {
      this.fetchKpiB2Results(this.moduleId);
    } else {
      console.warn('moduleId non è disponibile in OnInit');
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  // Getter per verificare se ci sono dati
  get hasData(): boolean {
    return this.dataSource && this.dataSource.data && this.dataSource.data.length > 0;
  }

  /**
   * Metodo per recuperare i risultati di KPI B2 dall'API
   */
  fetchKpiB2Results(moduleId: number): void {
    this.kpiB2ResultService.getKpiB2Results(moduleId).subscribe({
      next: (data: KpiB2Result[]) => {
        this.dataSource.data = data; // Aggiorna i dati della tabella
        console.log('Risultati KPI B2 recuperati:', data);

        // Assegna di nuovo il paginator ai dati (se esiste)
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: err => {
        console.error('Errore durante il recupero dei risultati KPI B2:', err);
      },
    });
  }
}
