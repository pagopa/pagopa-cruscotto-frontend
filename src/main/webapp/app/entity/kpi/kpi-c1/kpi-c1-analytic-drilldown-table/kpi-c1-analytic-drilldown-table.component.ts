import { AfterViewInit, Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { KpiC1PagopaDataDrilldownService } from '../service/kpi-c1-pagopa-data-drilldown.service';
import { IC1PagoPaDrilldown } from '../models/KpiC1AnalyticDrilldown';
import { FormatDatePipe } from 'app/shared/date';

@Component({
  selector: 'jhi-kpi-c1-analytic-drilldown-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, NgxSpinnerModule, MatPaginator, MatPaginatorModule, MatSortModule, FormatDatePipe],
  templateUrl: './kpi-c1-analytic-drilldown-table.component.html',
})
export class KpiC1AnalyticDrilldownTableComponent implements OnChanges, AfterViewInit {
  @Input() selectedKpiC1AnalyticResultId!: number;

  isLoadingResults = false;
  @Input() locale = 'it';

  displayedColumns = ['analysisDate', 'dataDate', 'institutionFiscalCode', 'positionsCount',  'messagesCount', 'percentageMessages'];
  dataSource = new MatTableDataSource<IC1PagoPaDrilldown>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly spinner = inject(NgxSpinnerService);
  private readonly pagopaDataService = inject(KpiC1PagopaDataDrilldownService);

  get hasData(): boolean {
    return !!this.dataSource?.data?.length;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (row, column) => {
      switch (column) {
        case 'analysisDate':
          return row.analysisDate ? row.analysisDate.valueOf() : -1;
        case 'dataDate':
          return row.dataDate ? row.dataDate.valueOf() : -1;
        case 'institutionFiscalCode':
          return row.institutionFiscalCode ?? '';
        case 'positionsCount':
          return row.positionsCount ?? -1;
        case 'messagesCount':
          return row.messagesCount ?? -1;
        case 'percentageMessages':
          return row.percentageMessages ?? -1;
        default:
          return 0;
      }
    };
  }

  ngOnChanges(): void {
    if (this.selectedKpiC1AnalyticResultId != null) {
      this.loadDrillDown();
    } else {
      this.dataSource.data = [];
    }
  }

  
  loadDrillDown(): void {
    this.spinner.show('isLoadingResultsKpiC1AnalyticDrilldown').then(() => {
      this.pagopaDataService.findByAnalyticDataId(this.selectedKpiC1AnalyticResultId).subscribe({
        next: res => {
          this.spinner.hide('isLoadingResultsKpiC1AnalyticDrilldown').then(() => {
            this.dataSource.data = res ?? [];
            this.paginator?.firstPage();
          });
        },
        error: err => {
          console.error('Failed to load C.1 drilldown', err);
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
        case 'analysisDate':
          return compare(a.analysisDate?.toISOString(), b.analysisDate?.toISOString(), isAsc);
        case 'dataDate':
          return compare(a.dataDate?.toISOString(), b.dataDate?.toISOString(), isAsc);
        case 'institutionFiscalCode':
          return compare(a.institutionFiscalCode, b.institutionFiscalCode, isAsc);
        case 'positionsCount':
          return compare(a.positionsCount, b.positionsCount, isAsc);
        case 'messagesCount':
          return compare(a.messagesCount, b.messagesCount, isAsc);
        case 'percentageMessages':
          return compare(a.percentageMessages, b.percentageMessages, isAsc);
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