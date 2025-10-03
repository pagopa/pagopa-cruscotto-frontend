import dayjs from 'dayjs/esm';

export class KpiB3DetailResult {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  evaluationType: string | null; // Assuming it's a string or enum
  evaluationStartDate: dayjs.Dayjs | null; // ISO string format
  evaluationEndDate: dayjs.Dayjs | null; // ISO string format
  totalStandIn: number | null;
  outcome: string | null; // Assuming it's an enum or string
  kpiB3ResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    evaluationType: EvaluationType | null = null,
    evaluationStartDate: dayjs.Dayjs | null = null,
    evaluationEndDate: dayjs.Dayjs | null = null,
    totalStandIn: number | null = null,
    outcome: OutcomeStatus | null = null,
    kpiB3ResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.evaluationType = evaluationType;
    this.evaluationStartDate = evaluationStartDate;
    this.evaluationEndDate = evaluationEndDate;
    this.totalStandIn = totalStandIn;
    this.outcome = outcome;
    this.kpiB3ResultId = kpiB3ResultId;
  }
}

// Enum di OutcomeStatus
export enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
  RUNNING = 'RUNNING',
  STANDBY = 'STANDBY',
}

// Enum di EvaluationType
export enum EvaluationType {
  MESE = 'MESE',
  TOTALE = 'TOTALE',
}
