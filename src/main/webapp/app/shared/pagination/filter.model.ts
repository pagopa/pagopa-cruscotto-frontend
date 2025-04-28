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
  TIME = 'TIME',
  NUMERIC = 'NUMERIC',
  PARTNER = 'PARTNER',
}

export interface ISortField {
  field: string;
  direction: SortDirection;
}

export declare type SortDirection = 'asc' | 'desc' | '';
