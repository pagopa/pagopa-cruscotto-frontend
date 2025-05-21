import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatCell, MatColumnDef, MatHeaderCell, MatHeaderRow, MatRow, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { KpiB2ResultService } from '../service/kpi-b2-result.service';
import { KpiB2Result } from '../models/KpiB2Result';

@Component({
  selector: 'jhi-kpi-b2-result-table',
  templateUrl: './kpi-b2-result-table.component.html',
  styleUrls: ['./kpi-b2-result-table.component.scss'],
  imports: [MatPaginator, MatTable, MatColumnDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow],
})
export class KpiB2ResultTableComponent implements OnInit, AfterViewInit {
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
  dataSource = new MatTableDataSource<KpiB2Result>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private kpiB2ResultService: KpiB2ResultService) {}

  ngOnInit(): void {
    this.fetchKpiB2Results();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Metodo per recuperare i risultati di KPI B2 dall'API
   */
  fetchKpiB2Results(): void {
    const moduleId = 1; // Da cambiare con l'ID del modulo desiderato
    this.kpiB2ResultService.getKpiB2Results(moduleId).subscribe({
      next: (data: KpiB2Result[]) => {
        this.dataSource.data = data; // Popola la tabella con i dati recuperati
      },
      error: err => {
        console.error('Errore durante il recupero dei risultati KPI B2:', err);
      },
    });
  }
}
