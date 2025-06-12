import dayjs from 'dayjs/esm';

export interface IStation {
  id: number;
  name?: string;
  partnerId?: number;
  activationDate?: dayjs.Dayjs | null;
  partnerFiscalCode?: string;
  partnerName?: string;
  typeConnection?: string;
  primitiveVersion?: number;
  paymentOption?: boolean;
  associatedInstitutes?: number;
  status?: string;
  deactivationDate?: dayjs.Dayjs | null;
  createdBy?: string;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string;
}
