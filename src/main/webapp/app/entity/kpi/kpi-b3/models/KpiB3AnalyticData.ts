import dayjs from 'dayjs/esm';

export class KpiB3AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  stationId: number | null;
  eventTimestamp: dayjs.Dayjs | null; // ISO string format
  standInCount: number | null = null;
  kpiB3DetailResultId: number | null;
  stationFiscalCode: string | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    eventTimestamp: dayjs.Dayjs | null = null,
    standInCount: number | null = null,
    kpiB3DetailResultId: number | null = null,
    stationFiscalCode: string | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.stationId = stationId;
    this.eventTimestamp = eventTimestamp;
    this.standInCount = standInCount;
    this.kpiB3DetailResultId = kpiB3DetailResultId;
    this.stationFiscalCode = stationFiscalCode;
  }
}
