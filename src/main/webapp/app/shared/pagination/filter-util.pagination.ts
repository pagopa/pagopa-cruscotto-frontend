import { AbstractControl } from '@angular/forms';
import { IFilterPagination } from './filter.pagination';
import { IParam, TypeData } from './filter.model';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT_ISO } from '../../config/input.constants';

export const addToFilter = (pagination: IFilterPagination, data: AbstractControl | null, param: IParam): void => {
  if (data != null) {
    if (data.value) {
      pagination.filters[param.name] = data.value;
    }
  }
};

export const addValueToFilter = (pagination: IFilterPagination, data: any | null, param: IParam): void => {
  if (data != null) {
    pagination.filters[param.name] = data;
  }
};

export const addFilterToRequest = (pagination: IFilterPagination, param: IParam, req: any): void => {
  const filter = pagination.filters[param.name];

  if (filter) {
    const value = getFilterValueByType(filter, param);

    if (value) {
      let isNotNullValue = true;

      if (param.nullValue?.includes(value)) {
        isNotNullValue = false;
      }

      if (isNotNullValue) {
        const reqFilter = { [param.req]: value };
        Object.assign(req, reqFilter);
      }
    }
  }
};

export const addConcatFilterToFirstFilterAndAddToRequest = (
  pagination: IFilterPagination,
  param01: IParam,
  param02: IParam,
  req: any,
): void => {
  let valueToSend = '';
  const filter01 = pagination.filters[param01.name];

  if (filter01) {
    const value = getFilterValueByType(filter01, param01);

    if (value) {
      let isNotNullValue = true;

      if (param01.nullValue?.includes(value)) {
        isNotNullValue = false;
      }

      if (isNotNullValue) {
        valueToSend = value;
      }
    }
  }

  const filter02 = pagination.filters[param02.name];
  if (filter01 && filter02) {
    const value = getFilterValueByType(filter02, param02);

    if (value) {
      let isNotNullValue = true;

      if (param02.nullValue?.includes(value)) {
        isNotNullValue = false;
      }

      if (isNotNullValue) {
        valueToSend = valueToSend.concat(' ').concat(value);
      }
    }
  }

  if (valueToSend) {
    const reqFilter = { [param01.req]: valueToSend };
    Object.assign(req, reqFilter);
  }
};

export const getFilterValue = (pagination: IFilterPagination, param: IParam): any => {
  const filter = pagination.filters[param.name];
  return filter ? filter : param.defaultValue;
};

export const getFilterValueByType = (filter: Record<string, any> | null, param: IParam): any => {
  let value = null;

  if (filter) {
    switch (param.type) {
      case TypeData.DATE: {
        value = (filter as dayjs.Dayjs).format(DATE_FORMAT_ISO);
        break;
      }
      case TypeData.TIME: {
        const day = filter as Date;
        value = day.getHours().toString().padStart(2, '0').concat(':').concat(day.getMinutes().toString().padStart(2, '0'));
        break;
      }
      case TypeData.NUMERIC:
      case TypeData.STRING:
        value = filter;
        break;
    }

    return value;
  }
};
