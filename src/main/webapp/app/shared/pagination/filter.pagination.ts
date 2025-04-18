import { ISortField } from './filter.model';

export abstract class IFilterPagination {
  page = 1;
  filters: Record<string, any> = {};
  sort: ISortField = { field: 'id', direction: 'asc' };
  sortDefault: ISortField = { field: 'id', direction: 'asc' };
  search = false;

  clear(): void {
    this.page = 1;
    this.filters = {};
    this.sort = this.sortDefault;
    this.search = false;
  }
}
