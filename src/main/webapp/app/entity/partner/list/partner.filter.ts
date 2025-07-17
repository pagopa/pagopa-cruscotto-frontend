import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class PartnerFilter extends IFilterPagination {
  static PARTNER: IParam = { name: 'partner', req: 'partnerId', type: TypeData.PARTNER, defaultValue: '' };
  static ANALIZED: IParam = { name: 'analyzed', req: 'analyzed', type: TypeData.STRING, defaultValue: '' };
  static QUALIFIED: IParam = { name: 'qualified', req: 'qualified', type: TypeData.STRING, defaultValue: '' };
  static LAST_ANALYSIS_DATE: IParam = {
    name: 'lastAnalysisDate',
    req: 'lastAnalysisDate',
    type: TypeData.DATE,
    defaultValue: null,
  };
  static ANALYSIS_PERIOD_START_DATE: IParam = {
    name: 'analysisPeriodStartDate',
    req: 'analysisPeriodStartDate',
    type: TypeData.DATE,
    defaultValue: null,
  };
  static ANALYSIS_PERIOD_END_DATE: IParam = {
    name: 'analysisPeriodEndDate',
    req: 'analysisPeriodEndDate',
    type: TypeData.DATE,
    defaultValue: null,
  };
  static SHOW_NOT_ACTIVE: IParam = {
    name: 'showNotActive',
    req: 'showNotActive',
    type: TypeData.BOOLEAN,
    defaultValue: null,
  };
  sort: ISortField = { field: 'id', direction: 'desc' };
  sortDefault: ISortField = { field: 'id', direction: 'desc' };
}
