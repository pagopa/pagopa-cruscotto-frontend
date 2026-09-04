import { Directive, Inject, Input, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateFormat, DateDisplay, DateParse } from './custom-date-format';
import { DayjsDateAdapter } from '../adapter/dayjs-date.adapter';

@Directive({
  selector: '[jhiDatePickerFormat]',
  providers: [
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useClass: CustomDateFormat,
    },
  ],
})
export class DatePickerFormatDirective {
  @Input() public configDateParse?: DateParse;
  @Input() public configDateDisplay?: DateDisplay;

  @Input()
  set jhiDatePickerFormat(format: string) {
    if (this.configDateParse) {
      this.matDateFormat.updateDateFormat(this.configDateParse, this.configDateDisplay);
    } else {
      this.matDateFormat.updateDateFormat({ dateInput: format });
    }

    const value = this.ngControl.value;
    this.ngControl.valueAccessor?.writeValue(value);
  }

  constructor(
    @Inject(MAT_DATE_FORMATS) public matDateFormat: CustomDateFormat,
    @Optional() private ngControl: NgControl,
  ) {}
}
