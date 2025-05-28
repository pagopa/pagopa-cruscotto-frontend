import dayjs from 'dayjs/esm';

export class KpiA1DetailResult {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format for date
  stationId: number | null;
  method: string | null;
  evaluationType: EvaluationType | null;
  evaluationStartDate: dayjs.Dayjs | null; // ISO string format for date
  evaluationEndDate: dayjs.Dayjs | null; // ISO string format for date
  totReq: number | null;
  reqTimeout: number | null;
  timeoutPercentage: number | null;
  outcome: OutcomeStatus | null;
  kpiA1ResultId: number | null;
  stationName: string | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    method: string | null = null,
    evaluationType: EvaluationType | null = null,
    evaluationStartDate: dayjs.Dayjs | null = null,
    evaluationEndDate: dayjs.Dayjs | null = null,
    totReq: number | null = null,
    reqTimeout: number | null = null,
    timeoutPercentage: number | null = null,
    outcome: OutcomeStatus | null = null,
    kpiA1ResultId: number | null = null,
    stationName: string | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.stationId = stationId;
    this.method = method;
    this.evaluationType = evaluationType;
    this.evaluationStartDate = evaluationStartDate;
    this.evaluationEndDate = evaluationEndDate;
    this.totReq = totReq;
    this.reqTimeout = reqTimeout;
    this.timeoutPercentage = timeoutPercentage;
    this.outcome = outcome;
    this.kpiA1ResultId = kpiA1ResultId;
    this.stationName = stationName;
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
