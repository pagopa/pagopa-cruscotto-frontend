import dayjs from 'dayjs/esm';

export interface KpiA1RecordedTimeout {
  fromHour: dayjs.Dayjs | null;
  id: number | null;
  kpiA1AnalyticDataId: number | null;
  okRequests: number | null;
  reqTimeout: number | null;
  toHour: dayjs.Dayjs | null;
  totalRequests: number | null;
}
