import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { KpiC1IODrilldownService } from '../service/kpi-c1-io-drilldown.service';
import { IC1IODrilldown } from '../models/KpiC1AnalyticDrilldown';
import { FormatDatePipe } from 'app/shared/date';

@Component({
  selector: 'jhi-kpi-c1-analytic-drilldown-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    NgxSpinnerModule,
    MatPaginator,
    MatPaginatorModule,
    MatSortModule,
    FormatDatePipe,
  ],
  templateUrl: './kpi-c1-analytic-drilldown-table.component.html',
})
export class KpiC1AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input() selectedKpiC1AnalyticResultId!: number;

  isLoadingResults = false;
  @Input() locale = 'it';

  displayedColumns = ['referenceDate', 'dataDate', 'cfInstitution', 'positionsCount', 'messagesCount', 'percentage'];
  dataSource = new MatTableDataSource<IC1IODrilldown>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly IOService = inject(KpiC1IODrilldownService);

  get hasData(): boolean {
    return !!this.dataSource?.data?.length;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (row, column) => {
      switch (column) {
        case 'referenceDate':
          return row.referenceDate ? row.referenceDate.valueOf() : -1;
        case 'dataDate':
          return row.dataDate ? row.dataDate.valueOf() : -1;
        case 'cfInstitution':
          return row.cfInstitution ?? '';
        case 'positionsCount':
          return row.positionsCount ?? -1;
        case 'messagesCount':
          return row.messagesCount ?? -1;
        case 'percentage':
          return row.percentage ?? -1;
        default:
          return 0;
      }
    };
  }

  ngOnChanges(): void {
    console.log('%c[DEBUG] ngOnChanges - DrilldownTable', 'color: #4caf50');
    console.log('selectedKpiC1AnalyticResultId ricevuto:', this.selectedKpiC1AnalyticResultId);

    if (this.selectedKpiC1AnalyticResultId != null) {
      console.log('[DEBUG] → Carico dati drilldown con ID:', this.selectedKpiC1AnalyticResultId);
      this.loadDrillDown();
    } else {
      console.log('[DEBUG] → Nessun ID, azzero i dati drilldown.');
      this.dataSource.data = [];
    }
  }

  // ngOnChanges(): void {
  //   if (this.selectedKpiC1AnalyticResultId != null) {
  //     this.loadDrillDown();
  //   } else {
  //     this.dataSource.data = [];
  //   }
  // }

  loadDrillDown(): void {
    console.log('[DEBUG] Fetch drilldown for analyticDataId:', this.selectedKpiC1AnalyticResultId);
    this.spinner.show('isLoadingResultsKpiC1AnalyticDrilldown').then(() => {
      this.IOService.findByAnalyticDataId(this.selectedKpiC1AnalyticResultId).subscribe({
        next: res => {
          console.log('[DEBUG] Drilldown raw response:', res);
          console.table(
            res.map(r => ({
              id: r.id,
              cfInstitution: r.cfInstitution,
              positionsCount: r.positionsCount,
              messagesCount: r.messagesCount,
              percentage: r.percentage,
            })),
          );
          res.forEach((item, i) => {
            console.log(
              `[${i}] analyticDataId=${item.analyticDataId}, cfInstitution=${item.cfInstitution}, referenceDate=${item.referenceDate}`,
            );
          });
          this.spinner.hide('isLoadingResultsKpiC1AnalyticDrilldown').then(() => {
            this.dataSource.data = res ?? [];
            console.log('[DEBUG] Drilldown response:', res);
            this.paginator?.firstPage();
          });
        },
        error: err => {
          console.error('[ERROR] Failed to load C.1 drilldown', err);
          this.spinner.hide('isLoadingResultsKpiC1AnalyticDrilldown');
        },
      });
    });
  }

  sortData(sort: Sort): void {
    const data = this.dataSource.data.slice();

    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'referenceDate':
          return compare(a.referenceDate?.toISOString(), b.referenceDate?.toISOString(), isAsc);
        case 'dataDate':
          return compare(a.dataDate?.toISOString(), b.dataDate?.toISOString(), isAsc);
        case 'cfInstitution':
          return compare(a.cfInstitution, b.cfInstitution, isAsc);
        case 'positionsCount':
          return compare(a.positionsCount, b.positionsCount, isAsc);
        case 'messagesCount':
          return compare(a.messagesCount, b.messagesCount, isAsc);
        case 'percentage':
          return compare(a.percentage, b.percentage, isAsc);
        default:
          return 0;
      }
    });
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
