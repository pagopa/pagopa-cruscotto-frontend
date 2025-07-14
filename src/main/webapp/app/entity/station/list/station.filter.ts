import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class StationFilter extends IFilterPagination {
  static PARTNER: IParam = { name: 'partner', req: 'partnerId', type: TypeData.PARTNER, defaultValue: '' };
  static STATION: IParam = { name: 'station', req: 'station', type: TypeData.STATION, defaultValue: '' };
  static SHOW_NOT_ACTIVE: IParam = { name: 'showNotActive', req: 'showNotActive', type: TypeData.BOOLEAN, defaultValue: null };
  sort: ISortField = { field: 'id', direction: 'desc' };
  sortDefault: ISortField = { field: 'id', direction: 'desc' };
}
