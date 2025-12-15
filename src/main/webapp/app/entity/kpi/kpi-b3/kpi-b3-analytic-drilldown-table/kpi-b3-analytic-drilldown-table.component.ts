import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatBadgeModule, MatBadge } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { KpiB3PagopaDataDrilldownService } from '../service/kpi-b3-pagopa-data-drilldown.service';
import { IB3PagoPaDrilldown } from '../models/KpiB3AnalyticDrilldown';
import { DetailStatusMarkerComponent } from 'app/shared/component/instance-detail-status-marker.component';
import { TableHeaderBarComponent } from 'app/shared/component/table-header-bar.component';

@Component({
  selector: 'jhi-kpi-b3-analytic-drilldown-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatBadgeModule,
    DetailStatusMarkerComponent,
    TableHeaderBarComponent,
  ],
  templateUrl: './kpi-b3-analytic-drilldown-table.component.html',
})
export class KpiB3AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input() selectedKpiB3AnalyticResultId!: number;

  isLoadingResults = false;
  showAllRows = false;
  isToggleDisabled = false;

  @Input() locale = 'it';

  displayedColumns = ['negativeData', 'partnerFiscalCode', 'intervalStart', 'intervalEnd', 'stationCode', 'standInCount'];
  dataSource = new MatTableDataSource<IB3PagoPaDrilldown>([]);
  originalData: IB3PagoPaDrilldown[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly pagopaDataService = inject(KpiB3PagopaDataDrilldownService);

  private headerPaginator?: MatPaginator;
  negativeCount = 0;
  toggleLabel = '';

  private readonly TOGGLE_LABELS = {
    onlyNegative: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.onlyNegative',
    onlyPositive: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.onlyPositive',
    showNegative: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.showNegative',
    showAll: 'pagopaCruscottoApp.module.toggleForAnalyticDataDetails.toggle.showAll',
  } as const;

  get hasData(): boolean {
    return !!this.dataSource?.data?.length;
  }

  /** paginator creato nel jhi-table-header-bar */
  onHeaderPaginatorReady(p: MatPaginator) {
    this.headerPaginator = p;
    this.dataSource.paginator = p;
  }

  ngAfterViewInit(): void {
    if (this.headerPaginator) {
      this.dataSource.paginator = this.headerPaginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

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
            this.originalData = res;
            const negatives = res.filter(d => (d.standInCount ?? 0) > 0);
            const positives = res.filter(d => d.standInCount === 0);

            this.negativeCount = negatives.length;

            this.updateToggleState(negatives.length, positives.length);

            this.dataSource.data = this.showAllRows ? res : negatives;

            if (this.headerPaginator) {
              this.dataSource.paginator = this.headerPaginator;
              this.headerPaginator.firstPage();
            }
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

  applyFilter(): void {
    if (this.showAllRows) {
      this.dataSource.data = this.originalData; // tutte
    } else {
      this.dataSource.data = this.originalData.filter(d => (d.standInCount ?? 0) > 0);
    }

    this.negativeCount = this.originalData.filter(d => (d.standInCount ?? 0) > 0).length;

    if (this.headerPaginator) {
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

/**
 * Funzione generica di confronto
 */
function compare(a: any, b: any, isAsc: boolean): number {
  if (a == null && b == null) return 0;
  if (a == null) return isAsc ? -1 : 1;
  if (b == null) return isAsc ? 1 : -1;
  return (a > b ? 1 : a < b ? -1 : 0) * (isAsc ? 1 : -1);
}
