import dayjs from 'dayjs/esm';
import { AnalysisType } from './analysis-type.model';
import { AnalysisOutcome } from './analysis-outcome.model';
import { ModuleStatus } from './module-status.model';

export interface IInstanceModule {
  id?: number;
  instanceId?: number;
  moduleId?: number;
  moduleCode?: string;
  analysisType?: AnalysisType;
  allowManualOutcome?: boolean;
  automaticOutcome?: AnalysisOutcome;
  automaticOutcomeDate?: dayjs.Dayjs; // Cambiato da Date a dayjs.Dayjs
  manualOutcome?: AnalysisOutcome;
  manualOutcomeDate?: dayjs.Dayjs; // Cambiato da Date a dayjs.Dayjs
  status?: ModuleStatus;
  assignedUserId?: number;
  assignedUserFirstName?: string;
  assignedUserLastName?: string;
}

export class InstanceModule implements IInstanceModule {
  constructor(
    public id?: number,
    public instanceId?: number,
    public moduleId?: number,
    public moduleCode?: string,
    public analysisType?: AnalysisType,
    public allowManualOutcome?: boolean,
    public automaticOutcome?: AnalysisOutcome,
    public automaticOutcomeDate?: dayjs.Dayjs, // Cambiato da Date a dayjs.Dayjs
    public manualOutcome?: AnalysisOutcome,
    public manualOutcomeDate?: dayjs.Dayjs, // Cambiato da Date a dayjs.Dayjs
    public status?: ModuleStatus,
    public assignedUserId?: number,
    public assignedUserFirstName?: string,
    public assignedUserLastName?: string,
  ) {}
}
