import dayjs from 'dayjs/esm';
import { IInstanceModule } from '../../instance-module/models/instance-module.model';
import { AnalysisOutcome } from 'app/entity/instance-module/models/analysis-outcome.model';

export interface IInstance {
  id: number;
  instanceIdentification?: string | null;
  partnerId?: number | null;
  partnerFiscalCode?: string | null;
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
  instanceModules?: IInstanceModule[] | null;
  lastAnalysisOutcome?: AnalysisOutcome | null;
  changePartnerQualified?: boolean | null;
  latestCompletedReportId?: number | null;
}

export type NewInstance = Omit<IInstance, 'id'> & { id: null };

export enum InstanceStatus {
  Bozza = 'BOZZA',
  Pianificata = 'PIANIFICATA',
  Eseguita = 'ESEGUITA',
  In_Esecuzione = 'IN_ESECUZIONE',
}

export class Instance implements IInstance {
  constructor(
    public id: number,
    public instanceIdentification?: string | null,
    public partnerId?: number | null,
    public partnerFiscalCode?: string | null,
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
    public lastAnalysisOutcome?: AnalysisOutcome | null,
    public instanceModules?: IInstanceModule[] | null,
    public changePartnerQualified?: boolean | null,
  ) {}
}
