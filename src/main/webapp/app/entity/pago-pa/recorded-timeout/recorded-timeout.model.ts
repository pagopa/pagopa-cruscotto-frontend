import dayjs from 'dayjs/esm';

export interface IPagoPaRecordedTimeout {
  id: number;
  cfPartner?: string | null;
  station?: string | null;
  method?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  totReq?: number | null;
  avgTime?: number | null;
  reqTimeout?: number | null;
}
