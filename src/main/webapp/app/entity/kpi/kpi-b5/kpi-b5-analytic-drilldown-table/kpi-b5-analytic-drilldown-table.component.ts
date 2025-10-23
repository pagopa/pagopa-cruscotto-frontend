import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { KpiB5PagopaDataDrilldownService } from '../service/kpi-b5-pagopa-data-drilldown.service';
import { IB5PagoPaDrilldown } from '../models/KpiB5AnalyticDrilldown';

@Component({
  selector: 'jhi-kpi-b5-analytic-drilldown-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, NgxSpinnerModule, MatPaginator, MatPaginatorModule, MatSortModule],
  templateUrl: './kpi-b5-analytic-drilldown-table.component.html',
})
export class KpiB5AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input() selectedKpiB5AnalyticResultId!: number;

  isLoadingResults = false;
  @Input() locale = 'it';

  displayedColumns = ['partnerFiscalCode', 'stationCode', 'spontaneousPayments'];
  dataSource = new MatTableDataSource<IB5PagoPaDrilldown>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly pagopaDataService = inject(KpiB5PagopaDataDrilldownService);

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
        case 'stationCode':
          return row.stationCode ?? '';
        case 'spontaneousPayments':
          return row.spontaneousPayments ?? '';
        default:
          return 0;
      }
    };

    this.sort.active = 'stationCode';
    this.sort.direction = 'asc';
    this.sort.sortChange.emit({ active: 'stationCode', direction: 'asc' });
  }

  ngOnChanges(): void {
    if (this.selectedKpiB5AnalyticResultId != null) {
      this.loadDrillDown();
    } else {
      this.dataSource.data = [];
    }
  }

  loadDrillDown(): void {
    this.spinner.show('isLoadingResultsKpiB5AnalyticDrilldown').then(() => {
      this.pagopaDataService.findByAnalyticDataId(this.selectedKpiB5AnalyticResultId).subscribe({
        next: res => {
          this.spinner.hide('isLoadingResultsKpiB5AnalyticDrilldown').then(() => {
            this.dataSource.data = res ?? [];
            this.paginator?.firstPage();
            
            setTimeout(() => {
              this.dataSource.sort = this.sort;
              this.sort.active = 'stationCode';
              this.sort.direction = 'asc';
              this.sort.sortChange.emit({ active: 'stationCode', direction: 'asc' });
            });
          });
        },
        error: err => {
          console.error('Failed to load B.5 drilldown', err);
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
        case 'stationCode':
          return compare(a.stationCode, b.stationCode, isAsc);
        case 'spontaneousPayments':
          return compare(a.spontaneousPayments, b.spontaneousPayments, isAsc);
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
