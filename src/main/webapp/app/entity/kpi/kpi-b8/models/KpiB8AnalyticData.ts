import dayjs from 'dayjs/esm';

export class KpiB8AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  dataDate: dayjs.Dayjs | null; // ISO string format
  totalRequests: number | null = null;
  koRequests: number | null = null;
  kpiB8DetailResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    dataDate: dayjs.Dayjs | null = null,
    totalRequests: number | null = null,
    koRequests: number | null = null,
    kpiB8DetailResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.dataDate = dataDate;
    this.totalRequests = totalRequests;
    this.koRequests = koRequests;
    this.kpiB8DetailResultId = kpiB8DetailResultId;
  }
}
