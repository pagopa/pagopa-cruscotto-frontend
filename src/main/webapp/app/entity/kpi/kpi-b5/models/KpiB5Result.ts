import dayjs from 'dayjs/esm';

export class KpiB5Result {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null;
  eligibilityThreshold: number | null;
  tolerance: number | null;
  outcome: OutcomeStatus | null;

  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    eligibilityThreshold: number | null = null,
    tolerance: number | null = null,
    outcome: OutcomeStatus | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.eligibilityThreshold = eligibilityThreshold;
    this.tolerance = tolerance;
    this.outcome = outcome;
  }
}

export enum EvaluationType {
  MESE = 'MESE',
  TOTALE = 'TOTALE',
}

export enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
  RUNNING = 'RUNNING',
  STANDBY = 'STANDBY',
}
