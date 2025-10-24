import dayjs from 'dayjs/esm';

export class KpiB8AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  evaluationDate: dayjs.Dayjs | null; // ISO string format
  totReq: number | null = null;
  reqKO: number | null = null;
  kpiB8DetailResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    evaluationDate: dayjs.Dayjs | null = null,
    totReq: number | null = null,
    reqKO: number | null = null,
    kpiB8DetailResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.evaluationDate = evaluationDate;
    this.totReq = totReq;
    this.reqKO = reqKO;
    this.kpiB8DetailResultId = kpiB8DetailResultId;
  }
}
