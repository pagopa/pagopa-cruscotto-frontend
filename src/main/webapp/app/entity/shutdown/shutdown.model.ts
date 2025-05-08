import dayjs from 'dayjs/esm';

export interface IShutdown {
  id: number;
  typePlanned?: TypePlanned;
  shutdownStartDate?: dayjs.Dayjs | null;
  shutdownEndDate?: dayjs.Dayjs | null;
  standIn?: boolean | null;
  year?: number | null;
  externalId?: number | null;
  partnerId?: number | null;
  partnerFiscalCode?: string | null;
  partnerName?: string | null;
  stationId: string | null;
  stationName: string | null;
}

export type NewShutdown = Omit<IShutdown, 'id'> & { id: null };

export enum TypePlanned {
  PROGRAMMATO = 'PROGRAMMATO',
  NON_PROGRAMMATO = 'NON PROGRAMMATO',
}
