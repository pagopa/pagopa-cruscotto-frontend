import dayjs from 'dayjs/esm';

export interface KpiB2RecordedTimeout {
  averageTimeMs: number | null;
  endHour: dayjs.Dayjs | null;
  fromHour: dayjs.Dayjs | null;
  id: number | null;
  kpiB2AnalyticDataId: number | null;
  okRequests: number | null;
  totalRequests: number | null;
}
