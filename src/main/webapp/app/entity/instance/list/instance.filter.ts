import { Injectable } from '@angular/core';
import { IFilterPagination } from '../../../shared/pagination/filter.pagination';
import { IParam, ISortField, TypeData } from '../../../shared/pagination/filter.model';

@Injectable({
  providedIn: 'root',
})
export class InstanceFilter extends IFilterPagination {
  static PARTNER: IParam = { name: 'partner', req: 'partnerId', type: TypeData.PARTNER, defaultValue: '' };
  static STATUS: IParam = { name: 'status', req: 'status', type: TypeData.STRING, defaultValue: '' };
  static PREDICTED_ANALYSIS_START_DATE: IParam = {
    name: 'predictedAnalysisStartDate',
    req: 'predictedAnalysisStartDate',
    type: TypeData.STRING,
    defaultValue: '',
  };
  static PREDICTED_ANALYSIS_END_DATE: IParam = {
    name: 'predictedAnalysisEndDate',
    req: 'predictedAnalysisEndDate',
    type: TypeData.STRING,
    defaultValue: '',
  };
  static ANALYSIS_START_DATE: IParam = { name: 'analysisStartDate', req: 'analysisStartDate', type: TypeData.STRING, defaultValue: '' };
  static ANALYSIS_END_DATE: IParam = { name: 'analysisEndDate', req: 'analysisEndDate', type: TypeData.STRING, defaultValue: '' };

  sort: ISortField = { field: 'predictedDateAnalysis', direction: 'desc' };
  sortDefault: ISortField = { field: 'predictedDateAnalysis', direction: 'desc' };
}
