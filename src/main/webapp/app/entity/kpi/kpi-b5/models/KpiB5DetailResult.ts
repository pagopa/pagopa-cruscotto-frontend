import dayjs from 'dayjs/esm';

export class KpiB5DetailResult {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null;
  stationId: number | null;
  stationsPresent: number | null;
  stationsWithoutSpontaneous: number | null;
  percentageNoSpontaneous: number | null;
  outcome: OutcomeStatus | null;
  kpiB5ResultId: number | null;

  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    stationsPresent: number | null,
    stationsWithoutSpontaneous: number | null,
    percentageNoSpontaneous: number | null,
    outcome: OutcomeStatus | null = null,
    kpiB5ResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.stationId = stationId;
    this.stationsPresent = stationsPresent;
    this.stationsWithoutSpontaneous = stationsWithoutSpontaneous;
    this.percentageNoSpontaneous = percentageNoSpontaneous;
    this.outcome = outcome;
    this.kpiB5ResultId = kpiB5ResultId;
  }
}

export enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
  RUNNING = 'RUNNING',
  STANDBY = 'STANDBY',
}
