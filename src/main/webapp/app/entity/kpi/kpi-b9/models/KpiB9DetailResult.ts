import dayjs from 'dayjs/esm';

export class KpiB9DetailResult {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null;
  stationId: number | null;
  evaluationType: EvaluationType | null;
  evaluationStartDate: dayjs.Dayjs | null;
  evaluationEndDate: dayjs.Dayjs | null;
  totRes: number | null;
  resKo: number | null;
  resKoPercentage: number | null;
  outcome: OutcomeStatus | null;
  kpiB9ResultId: number | null;
  stationName: string | null;

  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    evaluationType: EvaluationType | null = null,
    evaluationStartDate: dayjs.Dayjs | null = null,
    evaluationEndDate: dayjs.Dayjs | null = null,
    totRes: number | null = null,
    resKo: number | null = null,
    resKoPercentage: number | null = null,
    outcome: OutcomeStatus | null = null,
    kpiB9ResultId: number | null = null,
    stationName: string | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.stationId = stationId;
    this.evaluationType = evaluationType;
    this.evaluationStartDate = evaluationStartDate;
    this.evaluationEndDate = evaluationEndDate;
    this.totRes = totRes;
    this.resKo = resKo;
    this.resKoPercentage = resKoPercentage;
    this.outcome = outcome;
    this.kpiB9ResultId = kpiB9ResultId;
    this.stationName = stationName;
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
