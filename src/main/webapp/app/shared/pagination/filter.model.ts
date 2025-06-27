export interface IParam {
  name: string;
  req: string;
  type: TypeData;
  defaultValue: any;
  nullValue?: any[];
}

export const enum TypeData {
  STRING = 'STRING',
  DATE = 'DATE',
  START_DATE = 'START_DATE',
  END_DATE = 'END_DATE',
  TIME = 'TIME',
  NUMERIC = 'NUMERIC',
  PARTNER = 'PARTNER',
  PARTNER_FISCAL_CODE = 'PARTNER_FISCAL_CODE',
}

export interface ISortField {
  field: string;
  direction: SortDirection;
}

export declare type SortDirection = 'asc' | 'desc' | '';
