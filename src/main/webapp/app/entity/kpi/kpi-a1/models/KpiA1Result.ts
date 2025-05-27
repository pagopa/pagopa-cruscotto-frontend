import dayjs from 'dayjs/esm';
import { Instance } from '../../../instance/models/instance.model';
import { InstanceModule } from '../../../instance-module/models/instance-module.model';

export class KpiA1Result {
  id: number | null;
  instance: Instance | null;
  instanceId: number | null;
  instanceModule: InstanceModule | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format for date
  excludePlannedShutdown: boolean | null;
  excludeUnplannedShutdown: boolean | null;
  eligibilityThreshold: number | null;
  tolerance: number | null;
  evaluationType: EvaluationType | null;
  outcome: OutcomeStatus | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instance: Instance | null = null,
    instanceId: number | null = null,
    instanceModule: InstanceModule | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    excludePlannedShutdown: boolean | null = null,
    excludeUnplannedShutdown: boolean | null = null,
    eligibilityThreshold: number | null = null,
    tolerance: number | null = null,
    evaluationType: EvaluationType | null = null,
    outcome: OutcomeStatus | null = null,
  ) {
    this.id = id;
    this.instance = instance;
    this.instanceId = instanceId;
    this.instanceModule = instanceModule;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.excludePlannedShutdown = excludePlannedShutdown;
    this.excludeUnplannedShutdown = excludeUnplannedShutdown;
    this.eligibilityThreshold = eligibilityThreshold;
    this.tolerance = tolerance;
    this.evaluationType = evaluationType;
    this.outcome = outcome;
  }
}

// Enum di EvaluationType
export enum EvaluationType {
  MESE = 'MESE',
  TOTALE = 'TOTALE',
}

// Enum di OutcomeStatus
export enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
  RUNNING = 'RUNNING',
  STANDBY = 'STANDBY',
}
