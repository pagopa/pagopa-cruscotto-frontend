import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { KpiB4PagopaDataDrilldownService } from '../service/kpi-b6-pagopa-data-drilldown.service';
import { IB4PagoPaDrilldown } from '../models/KpiB4AnalyticDrilldown';
import { FormatDatePipe } from 'app/shared/date';

@Component({
  selector: 'jhi-kpi-b4-analytic-drilldown-table',
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
  templateUrl: './kpi-b4-analytic-drilldown-table.component.html',
})
export class KpiB4AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input() selectedKpiB4AnalyticResultId!: number;

  isLoadingResults = false;
  @Input() locale = 'it';

  displayedColumns = ['partnerFiscalCode', 'dataDate', 'stationCode', 'fiscalCode', 'api', 'totalRequests', 'okRequests', 'koRequests'];
  dataSource = new MatTableDataSource<IB4PagoPaDrilldown>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly pagopaDataService = inject(KpiB4PagopaDataDrilldownService);

  get hasData(): boolean {
    return !!this.dataSource?.data?.length;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (row, column) => {
      switch (column) {
        case 'partnerFiscalCode':
          return row.partnerFiscalCode ?? '';
        case 'dataDate':
          return row.dataDate ? row.dataDate.valueOf() : -1;
        case 'stationCode':
          return row.stationCode ?? '';
        case 'fiscalCode':
          return row.fiscalCode ?? '';
        case 'api':
          return row.api ?? '';
        case 'totalRequests':
          return row.totalRequests ?? -1;
        case 'okRequests':
          return row.okRequests ?? -1;
        case 'koRequests':
          return row.koRequests ?? -1;
        default:
          return 0;
      }
    };
  }

  ngOnChanges(): void {
    if (this.selectedKpiB4AnalyticResultId != null) {
      this.loadDrillDown();
    } else {
      this.dataSource.data = [];
    }
  }

  loadDrillDown(): void {
    this.spinner.show('isLoadingResultsKpiB4AnalyticDrilldown').then(() => {
      this.pagopaDataService.findByAnalyticDataId(this.selectedKpiB4AnalyticResultId).subscribe({
        next: res => {
          this.spinner.hide('isLoadingResultsKpiB4AnalyticDrilldown').then(() => {
            this.dataSource.data = res ?? [];
            this.paginator?.firstPage();
          });
        },
        error: err => {
          console.error('Failed to load B.4 drilldown', err);
          this.spinner.hide('isLoadingResultsKpiB2AnalyticDrilldown').then(() => {
            this.dataSource.data = [];
          });
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
        case 'partnerFiscalCode':
          return compare(a.partnerFiscalCode, b.partnerFiscalCode, isAsc);
        case 'dataDate':
          return compare(a.dataDate?.toISOString(), b.dataDate?.toISOString(), isAsc);
        case 'stationCode':
          return compare(a.stationCode, b.stationCode, isAsc);
        case 'fiscalCode':
          return compare(a.fiscalCode, b.fiscalCode, isAsc);
        case 'api':
          return compare(a.api, b.api, isAsc);
        case 'totalRequests':
          return compare(a.totalRequests, b.totalRequests, isAsc);
        case 'okRequests':
          return compare(a.okRequests, b.okRequests, isAsc);
        case 'koRequests':
          return compare(a.koRequests, b.koRequests, isAsc);
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
