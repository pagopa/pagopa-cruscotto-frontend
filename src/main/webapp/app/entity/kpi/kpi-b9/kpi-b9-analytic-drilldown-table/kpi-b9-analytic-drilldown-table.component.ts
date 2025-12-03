import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { KpiB9PaymentReceiptDrilldownService, B9DrilldownRow } from '../service/kpi-b9-payment-receipt-drilldown.service';
import dayjs, { Dayjs } from 'dayjs/esm';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { MatSlideToggle, MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'jhi-kpi-b9-analytic-drilldown-table',
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
  templateUrl: './kpi-b9-analytic-drilldown-table.component.html',
})
export class KpiB9AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) instanceId!: number;
  @Input({ required: true }) stationId!: number;
  @Input({ required: true }) evaluationDate!: Dayjs | Date | string;
  @Input() locale = 'it';

  displayedColumns = ['outcome', 'startTime', 'endTime', 'totRes', 'resKo'];
  dataSource = new MatTableDataSource<B9DrilldownRow>([]);
  data: B9DrilldownRow[] = [];
  koDataCount: number = 0;
  showAllRows = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly svc = inject(KpiB9PaymentReceiptDrilldownService);

  get hasData(): boolean {
    return !!this.dataSource?.data?.length;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (row, column) => {
      switch (column) {
        case 'startTime':
          return row.startTime ? row.startTime.valueOf() : -1;
        case 'endTime':
          return row.endTime ? row.endTime.valueOf() : -1;
        case 'totRes':
          return row.totRes ?? -1;
        case 'resKo':
          return row.resKo ?? -1;
        default:
          return 0;
      }
    };
  }

  ngOnChanges(): void {
    if (this.instanceId && this.stationId && this.evaluationDate) {
      const d = dayjs(this.evaluationDate);
      if (d.isValid()) this.load(d);
    }
  }

  private load(d: Dayjs): void {
    this.spinner.show('isLoadingResultsKpiB9AnalyticDrilldown').then(() => {
      this.svc.find(this.instanceId, this.stationId, d).subscribe({
        next: (rows: B9DrilldownRow[]) => {
          this.spinner.hide('isLoadingResultsKpiB9AnalyticDrilldown').then(() => {
            this.data = rows;
            this.dataSource.data = rows.filter(d => (d.resKo ?? 0) > 0);
            this.koDataCount = this.dataSource.data.length;

            this.showAllRows = false;

            this.applyFilter();

            // this.dataSource.sort = this.sort;
            this.paginator?.firstPage();
          });
        },
        error: () => this.spinner.hide('isLoadingResultsKpiB9AnalyticDrilldown').then(() => (this.dataSource.data = [])),
      });
    });
  }

  filterData(event: MatSlideToggleChange) {
    if (event.checked) {
      this.dataSource.data = this.data;
    } else {
      this.dataSource.data = this.data.filter(x => x.resKo && x.resKo > 0);
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
        case 'startTime':
          return compare(a.startTime?.toISOString(), b.startTime?.toISOString(), isAsc);
        case 'endTime':
          return compare(a.endTime?.toISOString(), b.endTime?.toISOString(), isAsc);
        case 'totRes':
          return compare(a.totRes, b.totRes, isAsc);
        case 'resKo':
          return compare(a.resKo, b.resKo, isAsc);
        default:
          return 0;
      }
    });
  }

  applyFilter(): void {
    this.dataSource.data = this.showAllRows ? this.data : this.data.filter(d => (d.resKo ?? 0) > 0);

    this.koDataCount = this.data.filter(d => (d.resKo ?? 0) > 0).length;

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
