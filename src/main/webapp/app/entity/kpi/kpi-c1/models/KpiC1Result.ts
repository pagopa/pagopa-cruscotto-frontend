import dayjs from 'dayjs/esm';

export class KpiC1Result {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format for dates
  eligibilityThreshold: number | null;
  tolerance: number | null;
  evaluationType: string | null; // Assuming it's an enum or string representation
  outcome: OutcomeStatus | null; // Assuming it's an enum or string representation

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    eligibilityThreshold: number | null = null,
    tolerance: number | null = null,
    evaluationType: string | null = null,
    outcome: OutcomeStatus | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
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
