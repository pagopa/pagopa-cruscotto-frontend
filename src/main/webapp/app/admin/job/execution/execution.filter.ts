import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class ExecutionFilter extends IFilterPagination {
  static SCHEDULER_NAME: IParam = { name: 'schedulerName', req: 'schedulerName', type: TypeData.STRING, defaultValue: null };
  static JOB_GROUP: IParam = { name: 'jobGroup', req: 'jobGroup', type: TypeData.STRING, defaultValue: null };
  static JOB_NAME: IParam = { name: 'jobName', req: 'jobName', type: TypeData.STRING, defaultValue: null };

  sort: ISortField = { field: 'scheduledTime', direction: 'desc' };
  sortDefault: ISortField = { field: 'scheduledTime', direction: 'desc' };

  clear() {
    this.page = 1;
    this.sort = this.sortDefault;
    this.search = false;
  }
}
