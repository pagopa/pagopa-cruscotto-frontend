import dayjs from 'dayjs/esm';

export interface IInstitute {
  id: number;
  fiscalCode?: string | null;
  name?: string;
  partnerFiscalCode?: string | null;
  partnerName?: string;
  stationName?: string;
  activationDate?: dayjs.Dayjs | null;
  deactivationDate?: dayjs.Dayjs | null;
  aca?: boolean;
  standIn?: boolean;
  status?: boolean;
  // createdBy?: string;
  // createdDate?: dayjs.Dayjs | null;
  // lastModifiedBy?: string;
  // lastModifiedDate?: dayjs.Dayjs | null;
}
