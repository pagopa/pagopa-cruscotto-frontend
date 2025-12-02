import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { KpiB8PagopaDataDrilldownService } from '../service/kpi-b8-pagopa-data-drilldown.service';
import { IB8PagoPaDrilldown } from '../models/KpiB8AnalyticDrilldown';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'jhi-kpi-b8-analytic-drilldown-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    NgxSpinnerModule,
    MatPaginator,
    MatPaginatorModule,
    MatSortModule,
    DetailStatusMarkerComponent,
    MatSlideToggleModule,
    MatBadgeModule,
  ],
  templateUrl: './kpi-b8-analytic-drilldown-table.component.html',
})
export class KpiB8AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input() selectedKpiB8AnalyticResultId!: number;

  isLoadingResults = false;
  @Input() locale = 'it';

  displayedColumns = [
    'outcome',
    'partnerFiscalCode',
    'dataDate',
    'stationCode',
    'fiscalCode',
    'api',
    'totalRequests',
    'okRequests',
    'koRequests',
  ];
  dataSource = new MatTableDataSource<IB8PagoPaDrilldown>([]);
  data: IB8PagoPaDrilldown[] = [];
  koDataCount: number = 0;
  showAllRows = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly pagopaDataService = inject(KpiB8PagopaDataDrilldownService);

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
    if (this.selectedKpiB8AnalyticResultId != null) {
      this.loadDrillDown();
    } else {
      this.dataSource.data = [];
    }
  }

  loadDrillDown(): void {
    this.spinner.show('isLoadingResultsKpiB8AnalyticDrilldown').then(() => {
      this.pagopaDataService.findByAnalyticDataId(this.selectedKpiB8AnalyticResultId).subscribe({
        next: res => {
          this.spinner.hide('isLoadingResultsKpiB8AnalyticDrilldown').then(() => {
            this.data = res;
            this.dataSource.data = res.filter(d => (d.koRequests ?? 0) > 0);
            this.koDataCount = this.dataSource.data.length;

            // reset toggle
            this.showAllRows = false;

            this.applyFilter();

            this.paginator?.firstPage();
          });
        },
        error: err => {
          console.error('Failed to load B.8 drilldown', err);
          this.spinner.hide('isLoadingResultsKpiB2AnalyticDrilldown').then(() => {
            this.dataSource.data = [];
            this.data = [];
          });
        },
      });
    });
  }

  filterData(event: MatSlideToggleChange) {
    if (event.checked) {
      this.dataSource.data = this.data;
    } else {
      this.dataSource.data = this.data.filter(_ => _.koRequests > 0);
    }
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

  applyFilter(): void {
    this.dataSource.data = this.showAllRows ? this.data : this.data.filter(d => (d.koRequests ?? 0) > 0);

    this.koDataCount = this.data.filter(d => (d.koRequests ?? 0) > 0).length;

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource._updateChangeSubscription();
      this.paginator.firstPage();
    }
  }

  onToggleChanged(value: boolean) {
    this.showAllRows = value;
    this.applyFilter();
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
