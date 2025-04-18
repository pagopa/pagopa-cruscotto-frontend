import { Pipe, PipeTransform } from '@angular/core';

import dayjs from 'dayjs/esm';
/* eslint-disable no-console */
@Pipe({
  name: 'formatDate',
})
export default class FormatDatePipe implements PipeTransform {
  transform(day: dayjs.Dayjs | null | undefined, format: string, locale: string): string {
    return day ? day.locale(locale).format(format) : '';
  }
}
