import { Component, Input } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'jhi-table-header-bar',
  standalone: true,
  template: `
    <div class="table-header-bar" [class.table-header-bar--sticky]="sticky">
      <div class="table-header-bar__left">
        <ng-content select="[table-header-left]"></ng-content>
      </div>

      <div class="table-header-bar__right">
        <ng-content select="[table-header-right]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .table-header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        padding: 8px 12px;
        border-bottom: 1px solid #ddd;
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
        gap: 10px;
      }
    `,
  ],
})
export class TableHeaderBarComponent {
  @Input() sticky = true;
}
