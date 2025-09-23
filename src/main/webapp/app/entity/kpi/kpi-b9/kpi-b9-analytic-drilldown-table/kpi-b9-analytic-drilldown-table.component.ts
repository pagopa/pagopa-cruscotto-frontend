import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { KpiB9PaymentReceiptDrilldownService, B9DrilldownRow } from '../service/kpi-b9-payment-receipt-drilldown.service';
import dayjs, { Dayjs } from 'dayjs/esm';

@Component({
  selector: 'jhi-kpi-b9-analytic-drilldown-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, NgxSpinnerModule, MatPaginator, MatPaginatorModule, MatSortModule],
  templateUrl: './kpi-b9-analytic-drilldown-table.component.html',
})
export class KpiB9AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) instanceId!: number;
  @Input({ required: true }) stationId!: number;
  @Input({ required: true }) evaluationDate!: Dayjs | Date | string;
  @Input() locale = 'it';

  displayedColumns = ['startTime', 'endTime', 'totRes', 'resKo'];
  dataSource = new MatTableDataSource<B9DrilldownRow>([]);

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
            const preset = [...(rows ?? [])].sort((a, b) => (a.startTime?.valueOf() ?? 0) - (b.startTime?.valueOf() ?? 0));
            this.dataSource.data = preset;

            this.dataSource.sort = this.sort;
            this.paginator?.firstPage();
          });
        },
        error: () => this.spinner.hide('isLoadingResultsKpiB9AnalyticDrilldown').then(() => (this.dataSource.data = [])),
      });
    });
  }
}
