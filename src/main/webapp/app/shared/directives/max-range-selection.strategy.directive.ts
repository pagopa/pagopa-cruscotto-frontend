import { Directive, Inject, Injectable, Input } from '@angular/core';
import { DateRange, MAT_DATE_RANGE_SELECTION_STRATEGY, MatDateRangeSelectionStrategy } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';

@Injectable()
export class MaxRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  start: any;
  public delta!: number;
  constructor(private _dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D, currentRange: DateRange<D>): DateRange<D> {
    let { start, end } = currentRange;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (start == null || (start && end)) {
      start = date;
      end = null;
    } else if (end == null) {
      const maxDate = this._dateAdapter.addCalendarDays(start, this.delta - 1);
      if (date && date >= start) {
        end = date > maxDate ? maxDate : date;
      } else {
        start = date;
      }
    }

    return new DateRange<D>(start, end);
  }
  createPreview(activeDate: D | null, currentRange: DateRange<D>): DateRange<D> {
    if ((!currentRange.start && !currentRange.end && activeDate) || (currentRange.start && currentRange.end && activeDate)) {
      const start = this._dateAdapter.addCalendarDays(activeDate, 0);
      const end = this._dateAdapter.addCalendarDays(activeDate, this.delta - 1);
      return new DateRange<D>(start, end);
    }

    if (currentRange.start && !currentRange.end && activeDate) {
      const end = this._dateAdapter.addCalendarDays(currentRange.start, this.delta - 1);
      return new DateRange(currentRange.start, end);
    }

    return new DateRange<D>(null, null);
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-date-range-picker[maxRange]',
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: MaxRangeSelectionStrategy,
    },
  ],
})
export default class MaxRangeDirective {
  constructor(
    @Inject(MAT_DATE_RANGE_SELECTION_STRATEGY)
    private maxRangeStrategy: MaxRangeSelectionStrategy<any>,
  ) {}

  @Input() set maxRange(value: number) {
    this.maxRangeStrategy.delta = +value || 7;
  }
}
