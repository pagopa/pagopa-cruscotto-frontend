import dayjs from 'dayjs/esm';

export class KpiB9Result {
  coId: number | null;
  coInstanceId: number | null;
  coInstanceModuleId: number | null;
  dtAnalisysDate: dayjs.Dayjs | null;
  flExcludePlannedShutdown: boolean | null;
  flExcludeUnplannedShutdown: boolean | null;
  coEligibilityThreshold: number | null;
  coTolerance: number | null;
  teEvaluationType: EvaluationType | null;
  teOutcome: OutcomeStatus | null;

  constructor(
    coId: number | null = null,
    coInstanceId: number | null = null,
    coInstanceModuleId: number | null = null,
    dtAnalisysDate: dayjs.Dayjs | null = null,
    flExcludePlannedShutdown: boolean | null = null,
    flExcludeUnplannedShutdown: boolean | null = null,
    coEligibilityThreshold: number | null = null,
    coTolerance: number | null = null,
    teEvaluationType: EvaluationType | null = null,
    teOutcome: OutcomeStatus | null = null,
  ) {
    this.coId = coId;
    this.coInstanceId = coInstanceId;
    this.coInstanceModuleId = coInstanceModuleId;
    this.dtAnalisysDate = dtAnalisysDate;
    this.flExcludePlannedShutdown = flExcludePlannedShutdown;
    this.flExcludeUnplannedShutdown = flExcludeUnplannedShutdown;
    this.coEligibilityThreshold = coEligibilityThreshold;
    this.coTolerance = coTolerance;
    this.teEvaluationType = teEvaluationType;
    this.teOutcome = teOutcome;
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
