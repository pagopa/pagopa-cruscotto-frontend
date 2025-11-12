import dayjs from 'dayjs/esm';

export class KpiC1DetailResult {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  evaluationType: string | null; // Assuming it's a string or enum
  evaluationStartDate: dayjs.Dayjs | null; // ISO string format
  evaluationEndDate: dayjs.Dayjs | null; // ISO string format
  totalInstitutions: number | null;
  okTotalInstitutions: number | null;
  percentageOkInstitutions: number | null;
  outcome: string | null; // Assuming it's an enum or string
  kpiC1ResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    evaluationType: EvaluationType | null = null,
    evaluationStartDate: dayjs.Dayjs | null = null,
    evaluationEndDate: dayjs.Dayjs | null = null,
    totalInstitutions: number | null = null,
    okTotalInstitutions: number | null = null,
    percentageOkInstitutions: number | null = null,
    outcome: OutcomeStatus | null = null,
    kpiC1ResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.evaluationType = evaluationType;
    this.evaluationStartDate = evaluationStartDate;
    this.evaluationEndDate = evaluationEndDate;
    this.totalInstitutions = totalInstitutions;
    this.okTotalInstitutions = okTotalInstitutions;
    this.percentageOkInstitutions = percentageOkInstitutions;
    this.outcome = outcome;
    this.kpiC1ResultId = kpiC1ResultId;
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
