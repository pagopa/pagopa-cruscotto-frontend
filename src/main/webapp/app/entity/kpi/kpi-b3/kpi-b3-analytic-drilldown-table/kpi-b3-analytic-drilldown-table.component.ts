import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { KpiB3PagopaDataDrilldownService } from '../service/kpi-b3-pagopa-data-drilldown.service';
import { IB3PagoPaDrilldown } from '../models/KpiB3AnalyticDrilldown';

@Component({
  selector: 'jhi-kpi-b3-analytic-drilldown-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, NgxSpinnerModule, MatPaginator, MatPaginatorModule, MatSortModule],
  templateUrl: './kpi-b3-analytic-drilldown-table.component.html',
})
export class KpiB3AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input() selectedKpiB3AnalyticResultId!: number;

  isLoadingResults = false;
  @Input() locale = 'it';

  displayedColumns = ['partnerFiscalCode', 'intervalStart', 'intervalEnd', 'stationCode', 'standInCount'];
  dataSource = new MatTableDataSource<IB3PagoPaDrilldown>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly pagopaDataService = inject(KpiB3PagopaDataDrilldownService);

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
        case 'intervalStart':
          return row.intervalStart ? row.intervalStart.valueOf() : -1;
        case 'intervalEnd':
          return row.intervalEnd ? row.intervalEnd.valueOf() : -1;
        case 'stationCode':
          return row.stationCode ?? '';
        case 'standInCount':
          return row.standInCount ?? -1;
        default:
          return 0;
      }
    };
  }

  ngOnChanges(): void {
    if (this.selectedKpiB3AnalyticResultId != null) {
      this.loadDrillDown();
    } else {
      this.dataSource.data = [];
    }
  }

  loadDrillDown(): void {
    this.spinner.show('isLoadingResultsKpiB3AnalyticDrilldown').then(() => {
      this.pagopaDataService.findByAnalyticDataId(this.selectedKpiB3AnalyticResultId).subscribe({
        next: res => {
          this.spinner.hide('isLoadingResultsKpiB3AnalyticDrilldown').then(() => {
            this.dataSource.data = res ?? [];
            this.paginator?.firstPage();
          });
        },
        error: err => {
          console.error('Failed to load B.3 drilldown', err);
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
        case 'intervalStart':
          return compare(a.intervalStart?.toISOString(), b.intervalStart?.toISOString(), isAsc);
        case 'intervalEnd':
          return compare(a.intervalEnd?.toISOString(), b.intervalEnd?.toISOString(), isAsc);
        case 'stationCode':
          return compare(a.stationCode, b.stationCode, isAsc);
        case 'standInCount':
          return compare(a.standInCount, b.standInCount, isAsc);
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
