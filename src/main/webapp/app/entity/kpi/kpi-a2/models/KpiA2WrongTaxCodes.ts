import dayjs from 'dayjs/esm';

export interface IWrongTaxCode {
  fromHour: dayjs.Dayjs | null;
  endHour: dayjs.Dayjs | null;
  transferCategory: string;
  total: number;
}
