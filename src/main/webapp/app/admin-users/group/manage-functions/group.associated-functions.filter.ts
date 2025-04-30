import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { ISortField } from '../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class GroupAssociatedFunctionsFilter extends IFilterPagination {
  sort: ISortField = { field: 'id', direction: 'desc' };
  sortDefault: ISortField = { field: 'id', direction: 'desc' };
}
