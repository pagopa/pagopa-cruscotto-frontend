import { Injectable } from '@angular/core';
import { ISortField } from 'app/shared/pagination/filter.model';
import { IFilterPagination } from 'app/shared/pagination/filter.pagination';

@Injectable({
  providedIn: 'root',
})
export class PagoPaPaymentReceiptFilter extends IFilterPagination {
  sort: ISortField = { field: 'startDate', direction: 'asc' };
  sortDefault: ISortField = { field: 'startDate', direction: 'asc' };
}
