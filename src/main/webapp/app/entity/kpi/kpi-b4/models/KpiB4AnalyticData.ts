import dayjs from 'dayjs/esm';

export class KpiB4AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  dataDate: dayjs.Dayjs | null; // ISO string format
  stationId: number | null;
  eventTimestamp: dayjs.Dayjs | null; // ISO string format
  totalGPD: number | null = null;
  totalCP: number | null = null;
  kpiB4DetailResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    dataDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    eventTimestamp: dayjs.Dayjs | null = null,
    totalGPD: number | null = null,
    totalCP: number | null = null,
    kpiB4DetailResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.dataDate = dataDate;
    this.stationId = stationId;
    this.eventTimestamp = eventTimestamp;
    this.totalGPD = totalGPD;
    this.totalCP = totalCP;
    this.kpiB4DetailResultId = kpiB4DetailResultId;
  }
}
