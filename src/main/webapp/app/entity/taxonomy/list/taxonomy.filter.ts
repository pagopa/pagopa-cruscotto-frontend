import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class TaxonomyFilter extends IFilterPagination {
  static TAKINGS_IDENTIFIER: IParam = { name: 'takingsIdentifier', req: 'takingsIdentifier', type: TypeData.STRING, defaultValue: null };

  sort: ISortField = { field: 'id', direction: 'desc' };
  sortDefault: ISortField = { field: 'id', direction: 'desc' };
}
