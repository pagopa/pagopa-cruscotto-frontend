import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class InstanceFilter extends IFilterPagination {
  static PARTNER: IParam = { name: 'partner', req: 'partnerId', type: TypeData.PARTNER, defaultValue: '' };

  sort: ISortField = { field: 'predictedDateAnalysis', direction: 'desc' };
  sortDefault: ISortField = { field: 'predictedDateAnalysis', direction: 'desc' };
}
