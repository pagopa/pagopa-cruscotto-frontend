import dayjs from 'dayjs/esm';

export class KpiC1AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  dataDate: dayjs.Dayjs | null; // ISO string format
  stationId: number | null;
  institutionCount: number | null = null;
  positionsCount: number | null;
  messagesCount: number | null;
  kpiC1DetailResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    dataDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    institutionCount: number | null = null,
    positionsCount: number | null = null,
    messagesCount: number | null = null,
    kpiC1DetailResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.dataDate = dataDate;
    this.stationId = stationId;
    this.institutionCount = institutionCount;
    this.positionsCount = positionsCount;
    this.messagesCount = messagesCount;
    this.kpiC1DetailResultId = kpiC1DetailResultId;
  }
}
