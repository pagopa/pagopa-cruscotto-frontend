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

  displayedColumns = ['indicator', 'fromHour', 'endHour', 'transferCategory', 'totPayments', 'totIncorrectPayments'];
  dataSource = new MatTableDataSource<IWrongTaxCode>([]);

  private readonly spinner = inject(NgxSpinnerService);
  private readonly taxService = inject(KpiA2WrongTaxCodesService);

  private headerPaginator?: MatPaginator;

  originalData: IWrongTaxCode[] = [];
  showAllRows = false;
  negativeCount = 0;

  isToggleDisabled = false;

  toggleLabel = '';

  private readonly TOGGLE_LABELS = {
    onlyNegative: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.onlyNegative',
    onlyPositive: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.onlyPositive',
    showNegative: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.showNegative',
    showAll: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.showAll',
  } as const;

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

            const negatives = res.filter(d => (d.totIncorrectPayments ?? 0) > 0);
            const positives = res.filter(d => d.totIncorrectPayments === 0);

            this.negativeCount = negatives.length;

            this.updateToggleState(negatives.length, positives.length);

            this.dataSource.data = this.showAllRows ? res : negatives;

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
    this.dataSource.data = this.showAllRows ? this.originalData : this.originalData.filter(d => (d.totIncorrectPayments ?? 0) > 0);

    this.negativeCount = this.originalData.filter(d => (d.totIncorrectPayments ?? 0) > 0).length;

    if (this.headerPaginator) {
      this.dataSource.paginator = this.headerPaginator;
      this.dataSource._updateChangeSubscription();
      this.headerPaginator.firstPage();
    }
  }

  onToggleChanged(value: boolean) {
    this.showAllRows = value;
    this.applyFilter();
    this.updateLabelAfterToggle(value);
  }

  private updateToggleState(negatives: number, positives: number): void {
    /** case 1: solo negativi */
    if (negatives > 0 && positives === 0) {
      this.showAllRows = false;
      this.isToggleDisabled = true;
      this.toggleLabel = this.TOGGLE_LABELS.onlyNegative;
      return;
    }

    /** case 2: solo positivi */
    if (positives > 0 && negatives === 0) {
      this.showAllRows = true;
      this.isToggleDisabled = true;
      this.toggleLabel = this.TOGGLE_LABELS.onlyPositive;
      return;
    }

    /** case 3: mix */
    this.showAllRows = false;
    this.isToggleDisabled = false;
    this.toggleLabel = this.TOGGLE_LABELS.showNegative;
  }

  private updateLabelAfterToggle(value: boolean): void {
    this.toggleLabel = value ? this.TOGGLE_LABELS.showAll : this.TOGGLE_LABELS.showNegative;
  }
}
