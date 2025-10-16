import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs/esm';

@Pipe({
  name: 'formatDate',
})
export default class FormatDatePipe implements PipeTransform {
  transform(date: dayjs.Dayjs | Date | null | undefined, format: string, locale: string): string {
    if (!date) return '';

    const d = dayjs.isDayjs(date) ? date : dayjs(date);
    return d.isValid() ? d.locale(locale).format(format) : '';
  }
}