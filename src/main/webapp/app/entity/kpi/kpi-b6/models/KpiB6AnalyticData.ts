import dayjs from 'dayjs/esm';

export interface KpiB6AnalyticData {
  id: number; // int64
  instanceId: number; // int64
  instanceModuleId: number; // int64
  anagStationId: number; // int64
  kpiB6DetailResultId: number; // int64
  eventId: string; // string
  eventType: string; // string
  analysisDate: string; // date
  stationCode: number; // int32
  paymentOption: 'SI' | 'NO'; // enum
}
