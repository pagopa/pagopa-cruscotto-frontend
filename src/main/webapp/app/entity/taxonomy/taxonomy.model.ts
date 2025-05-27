import dayjs from 'dayjs/esm';

export interface ITaxonomy {
  id: number;
  institutionTypeCode?: string | null;
  institutionType?: string | null;
  areaProgressiveCode?: string | null;
  areaName?: string | null;
  areaDescription?: string | null;
  serviceTypeCode?: string | null;
  serviceType?: string | null;
  serviceTypeDescription?: string | null;
  version?: string | null;
  reasonCollection?: string | null;
  takingsIdentifier?: string | null;
  validityStartDate?: dayjs.Dayjs | null;
  validityEndDate?: dayjs.Dayjs | null;
  createdBy?: string;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string;
  lastModifiedDate?: dayjs.Dayjs | null;
}
