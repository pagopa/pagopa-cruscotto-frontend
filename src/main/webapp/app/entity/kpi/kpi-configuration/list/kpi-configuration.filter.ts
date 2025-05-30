import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../../shared/pagination/filter.pagination';
import { ISortField } from '../../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class KpiConfigurationFilter extends IFilterPagination {
  sort: ISortField = { field: 'moduleCode', direction: 'asc' };
  sortDefault: ISortField = { field: 'moduleCode', direction: 'asc' };
}
