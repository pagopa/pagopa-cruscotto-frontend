import dayjs from 'dayjs/esm';

export class KpiB4DetailResult {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  evaluationType: string | null; // Assuming it's a string or enum
  evaluationStartDate: dayjs.Dayjs | null; // ISO string format
  evaluationEndDate: dayjs.Dayjs | null; // ISO string format
  totalGPD: number | null;
  totalCP: number | null;
  percentageCP: number | null;
  outcome: string | null; // Assuming it's an enum or string
  kpiB4ResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    evaluationType: EvaluationType | null = null,
    evaluationStartDate: dayjs.Dayjs | null = null,
    evaluationEndDate: dayjs.Dayjs | null = null,
    totalGPD: number | null = null,
    totalCP: number | null = null,
    percentageCP: number | null = null,
    outcome: OutcomeStatus | null = null,
    kpiB4ResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.evaluationType = evaluationType;
    this.evaluationStartDate = evaluationStartDate;
    this.evaluationEndDate = evaluationEndDate;
    this.totalGPD = totalGPD;
    this.totalCP = totalCP;
    this.percentageCP = percentageCP;
    this.outcome = outcome;
    this.kpiB4ResultId = kpiB4ResultId;
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
