import dayjs from 'dayjs/esm';

export class KpiA1AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format for date
  stationId: number | null;
  method: string | null;
  evaluationDate: dayjs.Dayjs | null; // ISO string format for date
  totalRequests: number | null;
  reqOk: number | null;
  reqTimeoutReal: number | null;
  reqTimeoutValid: number | null;
  kpiA1DetailResultId: number | null;
  stationName: string | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    method: string | null = null,
    evaluationDate: dayjs.Dayjs | null = null,
    totalRequests: number | null = null,
    reqOk: number | null = null,
    reqTimeoutReal: number | null = null,
    reqTimeoutValid: number | null = null,
    kpiA1DetailResultId: number | null = null,
    stationName: string | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.stationId = stationId;
    this.method = method;
    this.evaluationDate = evaluationDate;
    this.totalRequests = totalRequests;
    this.reqOk = reqOk;
    this.reqTimeoutReal = reqTimeoutReal;
    this.reqTimeoutValid = reqTimeoutValid;
    this.kpiA1DetailResultId = kpiA1DetailResultId;
    this.stationName = stationName;
  }
}
