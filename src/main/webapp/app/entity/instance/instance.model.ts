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

export class Instance implements IInstance {
  constructor(
    public id: number,
    public instanceIdentification?: string | null,
    public partnerId?: number | null,
    public partnerName?: string | null,
    public predictedDateAnalysis?: dayjs.Dayjs | null,
    public applicationDate?: dayjs.Dayjs | null,
    public assignedUserId?: number,
    public assignedFirstName?: string,
    public assignedLastName?: string,
    public analysisPeriodStartDate?: dayjs.Dayjs | null,
    public analysisPeriodEndDate?: dayjs.Dayjs | null,
    public status?: InstanceStatus,
    public lastAnalysisDate?: dayjs.Dayjs | null,
  ) {}
}
