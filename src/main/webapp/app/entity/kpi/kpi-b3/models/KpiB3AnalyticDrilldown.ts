import dayjs from 'dayjs/esm';

export interface IB3PagoPaDrilldown {
  partnerFiscalCode: string | null;
  intervalStart: Date | null;
  intervalEnd: Date | null;
  stationCode: string | null;
  standInCount: number;
}