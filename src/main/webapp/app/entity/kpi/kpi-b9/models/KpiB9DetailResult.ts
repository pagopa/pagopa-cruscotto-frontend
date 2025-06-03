import dayjs from 'dayjs/esm';

export class KpiB9DetailResult {
  coId: number | null;
  coInstanceId: number | null;
  coInstanceModuleId: number | null;
  dtAnalisysDate: dayjs.Dayjs | null;
  coStationId: number | null;
  teEvaluationType: EvaluationType | null;
  dtEvaluationStartDate: dayjs.Dayjs | null;
  dtEvaluationEndDate: dayjs.Dayjs | null;
  coTotRes: number | null;
  coResKo: number | null;
  coResKoPercentage: number | null;
  teOutcome: OutcomeStatus | null;
  coKpiB9ResultId: number | null;

  constructor(
    coId: number | null = null,
    coInstanceId: number | null = null,
    coInstanceModuleId: number | null = null,
    dtAnalisysDate: dayjs.Dayjs | null = null,
    coStationId: number | null = null,
    teEvaluationType: EvaluationType | null = null,
    dtEvaluationStartDate: dayjs.Dayjs | null = null,
    dtEvaluationEndDate: dayjs.Dayjs | null = null,
    coTotRes: number | null = null,
    coResKo: number | null = null,
    coResKoPercentage: number | null = null,
    teOutcome: OutcomeStatus | null = null,
    coKpiB9ResultId: number | null = null,
  ) {
    this.coId = coId;
    this.coInstanceId = coInstanceId;
    this.coInstanceModuleId = coInstanceModuleId;
    this.dtAnalisysDate = dtAnalisysDate;
    this.coStationId = coStationId;
    this.teEvaluationType = teEvaluationType;
    this.dtEvaluationStartDate = dtEvaluationStartDate;
    this.dtEvaluationEndDate = dtEvaluationEndDate;
    this.coTotRes = coTotRes;
    this.coResKo = coResKo;
    this.coResKoPercentage = coResKoPercentage;
    this.teOutcome = teOutcome;
    this.coKpiB9ResultId = coKpiB9ResultId;
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
