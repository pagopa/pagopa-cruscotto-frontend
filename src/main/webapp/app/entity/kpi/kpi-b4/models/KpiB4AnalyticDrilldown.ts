import dayjs from 'dayjs/esm';

export interface IB4PagoPaDrilldown {
  partnerId: string | null;
  partnerName: string | null;
  partnerFiscalCode: string | null;
  dataDate: Date | null;
  stationCode: string | null;
  fiscalCode: string | null;
  api: string | null;
  totalRequests: number;
  okRequests: number;
  koRequests: number;
}