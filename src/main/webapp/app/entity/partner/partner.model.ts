import dayjs from 'dayjs/esm';

export interface IPartner {
  partnerIdentification: IPartnerIdentification;
  status?: string;
  qualified: boolean;
  deactivationDate?: dayjs.Dayjs | null;
  createdBy?: string;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string;
  lastModifiedDate?: dayjs.Dayjs | null;
  analysisPeriodStartDate?: dayjs.Dayjs | null;
  analysisPeriodEndDate?: dayjs.Dayjs | null;
  lastAnalysisDate?: dayjs.Dayjs | null;
  stationsCount?: number | null;
  associatedInstitutes?: number | null;
}

export interface IPartnerIdentification {
  id: number;
  fiscalCode?: string | null;
  name?: string;
}

export enum StatusOptions {
  yes = 'yes',
  no = 'no',
}
