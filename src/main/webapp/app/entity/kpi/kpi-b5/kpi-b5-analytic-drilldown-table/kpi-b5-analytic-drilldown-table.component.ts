import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { KpiB5PagopaDataDrilldownService } from '../service/kpi-b5-pagopa-data-drilldown.service';
import { IB5PagoPaDrilldown } from '../models/KpiB5AnalyticDrilldown';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'jhi-kpi-b5-analytic-drilldown-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    DetailStatusMarkerComponent,
    MatSlideToggleModule,
    MatBadgeModule,
    TableHeaderBarComponent,
  ],
  templateUrl: './kpi-b5-analytic-drilldown-table.component.html',
})
export class KpiB5AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input() selectedKpiB5AnalyticResultId!: number;
  @Input() locale = 'it';

  isLoadingResults = false;
  showAllRows = false;
  isToggleDisabled = false;

  displayedColumns = ['outcome', 'partnerFiscalCode', 'stationCode', 'spontaneousPayments'];
  dataSource = new MatTableDataSource<IB5PagoPaDrilldown>([]);
  originalData: IB5PagoPaDrilldown[] = [];
  negativeCount: number = 0;

  toggleLabel = '';

  private readonly TOGGLE_LABELS = {
    onlyNegative: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.onlyNegative',
    onlyPositive: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.onlyPositive',
    showNegative: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.showNegative',
    showAll: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.showAll',
  } as const;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly pagopaDataService = inject(KpiB5PagopaDataDrilldownService);

  get hasData(): boolean {
    return !!this.dataSource?.data?.length;
  }

  /** paginator creato nel jhi-table-header-bar */
  onHeaderPaginatorReady(p: MatPaginator) {
    this.paginator = p;
    this.dataSource.paginator = p;
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
            this.originalData = res;
            const negatives = res.filter(d => d.spontaneousPayments === 'NON ATTIVI');
            const positives = res.filter(d => d.spontaneousPayments === 'ATTIVI');

            this.negativeCount = negatives.length;

            this.updateToggleState(negatives.length, positives.length);

            this.dataSource.data = this.showAllRows ? res : negatives;

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

  applyFilter(): void {
    this.dataSource.data = this.showAllRows ? this.originalData : this.originalData.filter(d => d.spontaneousPayments === 'NON ATTIVI');

    this.negativeCount = this.originalData.filter(d => d.spontaneousPayments === 'NON ATTIVI').length;

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource._updateChangeSubscription();
      this.paginator.firstPage();
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

/**
 * Funzione generica di confronto
 */
function compare(a: any, b: any, isAsc: boolean): number {
  if (a == null && b == null) return 0;
  if (a == null) return isAsc ? -1 : 1;
  if (b == null) return isAsc ? 1 : -1;
  return (a > b ? 1 : a < b ? -1 : 0) * (isAsc ? 1 : -1);
}
