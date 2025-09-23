import dayjs from 'dayjs/esm';

export interface IB9ReceiptDrilldown {
  fromHour: dayjs.Dayjs | null;
  endHour: dayjs.Dayjs | null;
  totRes: number;
  resKo: number;
}