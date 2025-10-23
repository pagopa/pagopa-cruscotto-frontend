import dayjs from 'dayjs/esm';

export interface KpiB1AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null;
  dataDate: dayjs.Dayjs | null;
  stationId: number | null;
  institutionCount: number | null;
  transactionCount: number | null;
  kpiB1DetailResultId: number | null;
  method: string | null;
}
