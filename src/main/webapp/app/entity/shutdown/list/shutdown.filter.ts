import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class ShutdownFilter extends IFilterPagination {
  static PARTNER: IParam = { name: 'partner', req: 'partnerId', type: TypeData.PARTNER, defaultValue: '' };
  static TYPE: IParam = { name: 'type', req: 'typePlanned', type: TypeData.STRING, defaultValue: '' };
  static YEAR: IParam = { name: 'year', req: 'year', type: TypeData.NUMERIC, defaultValue: dayjs().year() };
  static SHUTDOWN_START_DATE: IParam = {
    name: 'shutdownStartDate',
    req: 'shutdownStartDate',
    type: TypeData.DATE,
    defaultValue: null,
  };
  static SHUTDOWN_END_DATE: IParam = { name: 'shutdownEndDate', req: 'shutdownEndDate', type: TypeData.DATE, defaultValue: null };

  sort: ISortField = { field: 'shutdownStartDate', direction: 'desc' };
  sortDefault: ISortField = { field: 'shutdownStartDate', direction: 'desc' };
}
