import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { IWrongTaxCode } from '../models/KpiA2WrongTaxCodes';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { KpiA2WrongTaxCodesService } from '../service/kpi-a2-wrong-tax-codes.service';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

@Component({
  selector: 'jhi-kpi-a2-analytic-drilldown-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSlideToggleModule,
    TranslateModule,
    NgxSpinnerModule,
    FormsModule,
    MatBadgeModule,
    DatePipe,
    MatPaginatorModule,
    MatSortModule,
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
  templateUrl: './kpi-a2-analytic-drilldown-table.component.html',
})
export class KpiA2AnalyticDrilldownTableComponent implements OnChanges {
  @Input() analyticDataId!: number;
  @Input() locale: string = 'it';

  displayedColumns = ['indicator', 'fromHour', 'endHour', 'transferCategory', 'total'];
  dataSource = new MatTableDataSource<IWrongTaxCode>([]);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly taxService = inject(KpiA2WrongTaxCodesService);

  private headerPaginator?: MatPaginator;

  originalData: IWrongTaxCode[] = [];
  showAllRows = false;
  negativeCount = 0;

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  get hasData(): boolean {
    return this.dataSource?.data?.length > 0;
  }

  /** paginator creato nel jhi-table-header-bar */
  onHeaderPaginatorReady(p: MatPaginator) {
    this.headerPaginator = p;
    this.dataSource.paginator = p;
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
            this.originalData = res;
            this.dataSource.data = res.filter(d => (d.total ?? 0) > 0);
            this.negativeCount = this.dataSource.data.length;

            if (this.headerPaginator) {
              this.dataSource.paginator = this.headerPaginator;
              this.dataSource._updateChangeSubscription();
              this.headerPaginator.firstPage();
            }
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

  applyFilter(): void {
    this.dataSource.data = this.showAllRows ? this.originalData : this.originalData.filter(d => (d.total ?? 0) > 0);

    this.negativeCount = this.originalData.filter(d => (d.total ?? 0) > 0).length;

    if (this.headerPaginator) {
      this.dataSource.paginator = this.headerPaginator;
      this.dataSource._updateChangeSubscription();
      this.headerPaginator.firstPage();
    }
  }

  onToggleChanged(value: boolean) {
    this.showAllRows = value;
    this.applyFilter();
  }
}
