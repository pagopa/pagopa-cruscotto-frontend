import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-table-header-bar',
  standalone: true,
  imports: [MatPaginatorModule, MatSlideToggleModule, CommonModule, FormsModule],
  template: `
    <div class="table-header-bar" [class.table-header-bar--sticky]="sticky">
      <!-- SINISTRA: toggle opzionale -->
      <div class="table-header-bar__left">
        <mat-slide-toggle
          *ngIf="showToggle"
          [(ngModel)]="toggleValue"
          (change)="toggleChange.emit(toggleValue)"
          [disabled]="toggleDisabled"
          class="toggle-with-badge"
        >
          {{ toggleValue ? toggleLabelOn : toggleLabelOff }}
          <span class="toggle-badge-slot">
            <ng-content select="[toggle-badge]"></ng-content>
          </span>
        </mat-slide-toggle>

        <!-- eventuali contenuti custom -->
        <ng-content select="[table-header-left]"></ng-content>
      </div>

      <!-- DESTRA -->
      <div class="table-header-bar__right">
        <ng-content select="[table-header-right]"></ng-content>

        <mat-paginator
          *ngIf="showPaginator"
          #paginator
          [length]="length"
          [pageSize]="pageSize"
          [pageSizeOptions]="pageSizeOptions"
          showFirstLastButtons
        >
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [
    `
      .table-header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fdf8fd;
        border-bottom: 1px solid #ddd;
        padding: 8px 12px;
      }
      .table-header-bar--sticky {
        position: sticky;
        top: 0;
        z-index: 10;
      }
      .table-header-bar__left,
      .table-header-bar__right {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .toggle-with-badge .mdc-label {
        align-items: center;
      }
      .toggle-badge-slot {
        align-items: center;
        margin-left: 4px;
      }
      .toggle-badge-slot .mat-badge-content {
        font-size: 11px;
        line-height: 18px;
      }
    `,
  ],
})
export class TableHeaderBarComponent implements AfterViewInit {
  @Input() sticky = true;

  /** Paginator */
  @Input() showPaginator = true;
  @Input() pageSize = 35;
  @Input() pageSizeOptions: number[] = [35, 50, 100];
  @Input() length = 0;

  @ViewChild('paginator') paginator!: MatPaginator;
  @Output() paginatorReady = new EventEmitter<MatPaginator>();

  /** Toggle (opzionale) */
  @Input() showToggle = false;
  @Input() toggleDisabled = false;
  @Input() toggleValue = false;
  @Input() toggleLabelOn = '';
  @Input() toggleLabelOff = '';
  @Output() toggleChange = new EventEmitter<boolean>();

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginatorReady.emit(this.paginator);
    }
  }
}
