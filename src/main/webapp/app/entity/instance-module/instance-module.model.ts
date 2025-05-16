import { AnalysisType } from './analysis-type.model';
import { AnalysisOutcome } from './analysis-outcome.model';
import { ModuleStatus } from './module-status.model';

export interface IInstanceModule {
  id?: number; // ID dell'entità
  instanceId?: number;
  moduleId?: number;
  moduleCode?: string;
  analysisType?: AnalysisType;
  allowManualOutcome?: boolean;
  automaticOutcome?: AnalysisOutcome;
  automaticOutcomeDate?: Date; // Uso del tipo `Date` per Instant
  manualOutcome?: AnalysisOutcome;
  status?: ModuleStatus;
  assignedUserId?: number;
  manualOutcomeDate?: Date; // Uso del tipo `Date` per Instant
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
    public automaticOutcomeDate?: Date,
    public manualOutcome?: AnalysisOutcome,
    public status?: ModuleStatus,
    public assignedUserId?: number,
    public manualOutcomeDate?: Date,
  ) {
    this.allowManualOutcome = this.allowManualOutcome ?? false; // Default per `allowManualOutcome`
  }
}
