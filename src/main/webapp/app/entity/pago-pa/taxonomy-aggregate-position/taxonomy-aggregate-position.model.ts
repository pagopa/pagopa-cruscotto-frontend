import dayjs from 'dayjs/esm';

export interface IPagoPaTaxonomyAggregatePosition {
  id: number;
  cfPartner?: string | null;
  station?: string | null;
  transferCategory?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  total?: number | null;
}
