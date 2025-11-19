import dayjs from 'dayjs/esm';

export class KpiB5AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  eventType: string | null;
  analysisDate: dayjs.Dayjs | null;
  dataDate: dayjs.Dayjs | null;
  stationId: number | null;
  stationsPresent: number | null;
  stationsWithoutSpontaneous: number | null;
  percentageNoSpontaneous: number | null;
  outcome: OutcomeStatus | null;
  kpiB5DetailResultId: number | null;

  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    eventType: string | null,
    analysisDate: dayjs.Dayjs | null = null,
    dataDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    stationsPresent: number | null,
    stationsWithoutSpontaneous: number | null,
    percentageNoSpontaneous: number | null,
    outcome: OutcomeStatus | null = null,
    kpiB5DetailResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.eventType = eventType;
    this.analysisDate = analysisDate;
    this.dataDate = dataDate;
    this.stationId = stationId;
    this.stationsPresent = stationsPresent;
    this.stationsWithoutSpontaneous = stationsWithoutSpontaneous;
    this.percentageNoSpontaneous = percentageNoSpontaneous;
    this.outcome = outcome;
    this.kpiB5DetailResultId = kpiB5DetailResultId;
  }
}

export enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
  RUNNING = 'RUNNING',
  STANDBY = 'STANDBY',
}
