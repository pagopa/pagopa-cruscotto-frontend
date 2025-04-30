import { AfterContentInit, ContentChild, Directive, OnDestroy } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { distinctUntilChanged, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-date-range-input',
})
export class UpdateDateRangeValueAndValidityFixerDirective implements AfterContentInit, OnDestroy {
  @ContentChild(MatStartDate, { read: FormControlName }) startDateControlName!: FormControlName;
  @ContentChild(MatEndDate, { read: FormControlName }) endDateControlName!: FormControlName;

  private readonly destroyed$ = new Subject<void>();

  ngAfterContentInit(): void {
    if (this.startDateControlName.valueChanges) {
      this.startDateControlName.valueChanges
        .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
        .subscribe(() => setTimeout(() => this.endDateControlName.control.updateValueAndValidity()));
    }
    if (this.endDateControlName.valueChanges) {
      this.endDateControlName.valueChanges
        .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
        .subscribe(() => setTimeout(() => this.startDateControlName.control.updateValueAndValidity()));
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
