import dayjs from 'dayjs/esm';

export interface KpiB1AnalyticDrilldown {
  id: number | null;
  dataDate: dayjs.Dayjs | null;
  loadTimestamp: dayjs.Dayjs | null;
  partnerId: number | null;
  partnerName: string | null;
  fiscalCode: string | null;
  partnerFiscalCode: string | null;
  transactionCount: number | null;
  stationCode: number | null;
}
