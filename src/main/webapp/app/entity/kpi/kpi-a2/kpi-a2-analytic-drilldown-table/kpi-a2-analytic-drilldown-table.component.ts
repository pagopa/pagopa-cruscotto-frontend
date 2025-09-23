import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { IWrongTaxCode } from '../models/KpiA2WrongTaxCodes';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { KpiA2WrongTaxCodesService } from '../service/kpi-a2-wrong-tax-codes.service';

@Component({
  selector: 'jhi-kpi-a2-analytic-drilldown-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, NgxSpinnerModule, DatePipe, MatPaginatorModule, MatSortModule],
  templateUrl: './kpi-a2-analytic-drilldown-table.component.html',
})
export class KpiA2AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input() analyticDataId!: number;
  @Input() locale: string = 'it';

  displayedColumns = ['fromHour', 'endHour', 'transferCategory', 'total'];
  dataSource = new MatTableDataSource<IWrongTaxCode>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly taxService = inject(KpiA2WrongTaxCodesService);

  get hasData(): boolean {
    return this.dataSource?.data?.length > 0;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(): void {
    if (this.analyticDataId != null) {
      this.loadDrillDown();
    } else {
      this.dataSource.data = [];
    }
  }

  loadDrillDown(): void {
    this.spinner.show('isLoadingResultsKpiA2AnalyticDrilldown').then(() => {
      this.taxService.findByAnalyticDataId(this.analyticDataId).subscribe({
        next: res => {
          this.spinner.hide('isLoadingResultsKpiA2AnalyticDrilldown').then(() => {
            this.dataSource.data = res ?? [];
            this.paginator?.firstPage();
          });
        },
        error: err => {
          console.error('Failed to load A.2 drilldown', err);
          this.spinner.hide('isLoadingResultsKpiA2AnalyticDrilldown').then(() => {
            this.dataSource.data = [];
          });
        },
      });
    });
  }
}
