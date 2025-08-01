import dayjs from 'dayjs/esm';

export interface IInstitute {
  institutionIdentification: IInstituteIdentification;
  partnerFiscalCode?: string | null;
  partnerName?: string;
  stationName?: string;
  activationDate?: dayjs.Dayjs | null;
  deactivationDate?: dayjs.Dayjs | null;
  aca?: boolean;
  standIn?: boolean;
  enabled?: boolean;
  // createdBy?: string;
  // createdDate?: dayjs.Dayjs | null;
  // lastModifiedBy?: string;
  // lastModifiedDate?: dayjs.Dayjs | null;
}

export interface IInstituteIdentification {
  id: number;
  fiscalCode: string | null;
  name: string;
}
