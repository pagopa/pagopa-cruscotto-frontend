import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionFilter extends IFilterPagination {
  static NOME: IParam = { name: 'nome', req: 'nome', type: TypeData.STRING, defaultValue: null };
  static MODULO: IParam = { name: 'modulo', req: 'modulo', type: TypeData.STRING, defaultValue: null };

  sort: ISortField = { field: 'id', direction: 'desc' };
  sortDefault: ISortField = { field: 'id', direction: 'desc' };
}
