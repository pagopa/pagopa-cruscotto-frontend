import dayjs from 'dayjs/esm';

export class KpiB2Result {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format for dates
  excludePlannedShutdown: boolean | null;
  excludeUnplannedShutdown: boolean | null;
  eligibilityThreshold: number | null;
  tollerance: number | null;
  averageTimeLimit: number | null;
  evaluationType: string | null; // Assuming it's an enum or string representation
  outcome: string | null; // Assuming it's an enum or string representation

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    excludePlannedShutdown: boolean | null = null,
    excludeUnplannedShutdown: boolean | null = null,
    eligibilityThreshold: number | null = null,
    tollerance: number | null = null,
    averageTimeLimit: number | null = null,
    evaluationType: string | null = null,
    outcome: string | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.excludePlannedShutdown = excludePlannedShutdown;
    this.excludeUnplannedShutdown = excludeUnplannedShutdown;
    this.eligibilityThreshold = eligibilityThreshold;
    this.tollerance = tollerance;
    this.averageTimeLimit = averageTimeLimit;
    this.evaluationType = evaluationType;
    this.outcome = outcome;
  }
}

export enum EvaluationType {
  TYPE_1 = 'TYPE_1',
  TYPE_2 = 'TYPE_2',
}

export enum OutcomeStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}
