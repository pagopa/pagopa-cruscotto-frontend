import { Injectable } from '@angular/core';
import { IParam, ISortField, TypeData } from 'app/shared/pagination/filter.model';
import { IFilterPagination } from 'app/shared/pagination/filter.pagination';

@Injectable({
  providedIn: 'root',
})
export class PaymentReceiptFilter extends IFilterPagination {
  static PARTNER: IParam = { name: 'cfPartner', req: 'cfPartner', type: TypeData.PARTNER_FISCAL_CODE, defaultValue: '' };
  static STATION: IParam = { name: 'station', req: 'station', type: TypeData.STRING, defaultValue: '' };
  sort: ISortField = { field: 'startDate', direction: 'asc' };
  sortDefault: ISortField = { field: 'startDate', direction: 'asc' };
}
