import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class InstituteFilter extends IFilterPagination {
  static PARTNER: IParam = { name: 'partner', req: 'partnerId', type: TypeData.PARTNER, defaultValue: '' };
  static STATION: IParam = { name: 'station', req: 'stationId', type: TypeData.STATION, defaultValue: '' };
  static INSTITUTE: IParam = { name: 'institute', req: 'institutionId', type: TypeData.ID, defaultValue: '' };
  static SHOW_NOT_ACTIVE: IParam = { name: 'showNotActive', req: 'showNotEnabled', type: TypeData.BOOLEAN, defaultValue: null };
  sort: ISortField = { field: 'id', direction: 'desc' };
  sortDefault: ISortField = { field: 'id', direction: 'desc' };
}
