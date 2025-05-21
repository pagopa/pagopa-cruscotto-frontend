import dayjs from 'dayjs/esm';

export class KpiB2DetailResult {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  stationId: number | null;
  method: string | null;
  evaluationType: string | null; // Assuming it's a string or enum
  evaluationStartDate: dayjs.Dayjs | null; // ISO string format
  evaluationEndDate: dayjs.Dayjs | null; // ISO string format
  totReq: number | null;
  avgTime: number | null;
  overTimeLimit: number | null;
  outcome: string | null; // Assuming it's an enum or string
  kpiB2ResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    method: string | null = null,
    evaluationType: string | null = null,
    evaluationStartDate: dayjs.Dayjs | null = null,
    evaluationEndDate: dayjs.Dayjs | null = null,
    totReq: number | null = null,
    avgTime: number | null = null,
    overTimeLimit: number | null = null,
    outcome: string | null = null,
    kpiB2ResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.stationId = stationId;
    this.method = method;
    this.evaluationType = evaluationType;
    this.evaluationStartDate = evaluationStartDate;
    this.evaluationEndDate = evaluationEndDate;
    this.totReq = totReq;
    this.avgTime = avgTime;
    this.overTimeLimit = overTimeLimit;
    this.outcome = outcome;
    this.kpiB2ResultId = kpiB2ResultId;
  }
}
