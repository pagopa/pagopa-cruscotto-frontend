import dayjs from 'dayjs/esm';

export interface IInstance {
  id: number;
  instanceIdentification?: string | null;
  partnerId?: number | null;
  partnerName?: string | null;
  predictedDateAnalysis?: dayjs.Dayjs | null;
  applicationDate?: dayjs.Dayjs | null;
  assignedUserId?: number;
  assignedFirstName?: string;
  assignedLastName?: string;
  analysisPeriodStartDate?: dayjs.Dayjs | null;
  analysisPeriodEndDate?: dayjs.Dayjs | null;
  status?: InstanceStatus;
  lastAnalysisDate?: dayjs.Dayjs | null;
}

export type NewInstance = Omit<IInstance, 'id'> & { id: null };

export enum InstanceStatus {
  Bozza = 'BOZZA',
  Pianificata = 'PIANIFICATA',
  Eseguita = 'ESEGUITA',
  Cancellata = 'CANCELLATA',
}
