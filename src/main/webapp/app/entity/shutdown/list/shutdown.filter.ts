import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class ShutdownFilter extends IFilterPagination {
  static PARTNER: IParam = { name: 'partner', req: 'partnerId', type: TypeData.PARTNER, defaultValue: '' };
  static TYPE: IParam = { name: 'type', req: 'typePlanned', type: TypeData.STRING, defaultValue: '' };

  sort: ISortField = { field: 'shutdownStartDate', direction: 'desc' };
  sortDefault: ISortField = { field: 'shutdownStartDate', direction: 'desc' };
}
