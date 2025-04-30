import { Pipe, PipeTransform } from '@angular/core';

import dayjs from 'dayjs/esm';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'formatTime',
})
export default class FormatTimePipe implements PipeTransform {
  transform(day: Date | null | undefined): string {
    return day ? day.getHours().toString().padStart(2, '0').concat(':').concat(day.getMinutes().toString().padStart(2, '0')) : '';
  }
}
