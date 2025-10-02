import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, NgClass, DecimalPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import FormatDatePipe from 'app/shared/date/format-date.pipe';
import { YesOrNoViewComponent } from 'app/shared/component/yes-or-no-view.component';

enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
}

@Component({
  selector: 'jhi-kpi-b3-result-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    TranslateModule,
    NgxSpinnerModule,
    FormatDatePipe,
    YesOrNoViewComponent,
    NgClass,
    DecimalPipe,
  ],
  templateUrl: './kpi-b3-result-table.component.html',
  styleUrl: './kpi-b3-result-table.component.scss',
})
export class KpiB3ResultTableComponent {
  @Input() moduleId?: number;
  @Output() showDetails = new EventEmitter<number>();

  displayedColumns: string[] = [
    'analysisDate',
    'excludePlannedShutdown',
    'excludeUnplannedShutdown',
    'eligibilityThreshold',
    'evaluationType',
    'outcome',
    'details',
  ];

  dataSource = new MatTableDataSource<any>([]);
  selectedElementId: number | null = null;
  locale: string;

  protected readonly OutcomeStatus = OutcomeStatus;
  private readonly translateService = inject(TranslateService);
  

  get hasData(): boolean {
    return this.dataSource.data?.length > 0;
  }

  constructor(){
    this.locale = this.translateService.currentLang;
  }

  sortData(_sort: Sort): void {
    
  }

  emitShowDetails(id: number): void {
    this.selectedElementId = id;
    this.showDetails.emit(id);
  }
}
