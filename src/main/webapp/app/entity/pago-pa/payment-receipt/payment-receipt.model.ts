import dayjs from 'dayjs/esm';

export interface IPagoPaPaymentReceipt {
  id: number;
  cfPartner?: string | null;
  station?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  totRes?: number | null;
  resOk?: number | null;
  resKo?: number | null;
}
