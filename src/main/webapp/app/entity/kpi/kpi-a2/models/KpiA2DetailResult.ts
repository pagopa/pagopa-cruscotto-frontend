import dayjs from 'dayjs/esm';

export class KpiA2DetailResult {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format for date
  evaluationStartDate: dayjs.Dayjs | null; // ISO string format for date
  evaluationEndDate: dayjs.Dayjs | null; // ISO string format for date
  totPayments: number | null;
  totIncorrectPayments: number | null;
  errorPercentage: number | null;
  outcome: OutcomeStatus | null;
  kpiA2ResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    evaluationStartDate: dayjs.Dayjs | null = null,
    evaluationEndDate: dayjs.Dayjs | null = null,
    totPayments: number | null = null,
    totIncorrectPayments: number | null = null,
    errorPercentage: number | null = null,
    outcome: OutcomeStatus | null = null,
    kpiA2ResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.evaluationStartDate = evaluationStartDate;
    this.evaluationEndDate = evaluationEndDate;
    this.totPayments = totPayments;
    this.totIncorrectPayments = totIncorrectPayments;
    this.errorPercentage = errorPercentage;
    this.outcome = outcome;
    this.kpiA2ResultId = kpiA2ResultId;
  }
}

// Enum di OutcomeStatus
export enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
  RUNNING = 'RUNNING',
  STANDBY = 'STANDBY',
}
