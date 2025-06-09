import { Injectable } from '@angular/core';
import { ISortField } from 'app/shared/pagination/filter.model';
import { IFilterPagination } from 'app/shared/pagination/filter.pagination';

@Injectable({
  providedIn: 'root',
})
export class ModuleFilter extends IFilterPagination {
  sort: ISortField = { field: 'code', direction: 'asc' };
  sortDefault: ISortField = { field: 'code', direction: 'asc' };
}
