import dayjs from 'dayjs/esm';

export class KpiB2AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  stationId: number | null;
  method: string | null;
  evaluationDate: dayjs.Dayjs | null; // ISO string format
  totReq: number | null;
  reqOk: number | null;
  reqTimeout: number | null;
  avgTime: number | null;
  kpiB2DetailResultId: number | null;
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
    totReq: number | null = null,
    reqOk: number | null = null,
    reqTimeout: number | null = null,
    avgTime: number | null = null,
    kpiB2DetailResultId: number | null = null,
    stationName: string | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.stationId = stationId;
    this.method = method;
    this.evaluationDate = evaluationDate;
    this.totReq = totReq;
    this.reqOk = reqOk;
    this.reqTimeout = reqTimeout;
    this.avgTime = avgTime;
    this.kpiB2DetailResultId = kpiB2DetailResultId;
    this.stationName = stationName;
  }
}
