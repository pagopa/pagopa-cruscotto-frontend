import dayjs from 'dayjs/esm';

export interface IPartner {
  id: number;
  fiscalCode?: string | null;
  name?: string;
  status?: string;
  qualified: boolean;
  deactivationDate?: dayjs.Dayjs | null;
  createdBy?: string;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export enum StatusOptions {
  yes = 'yes',
  no = 'no',
}
