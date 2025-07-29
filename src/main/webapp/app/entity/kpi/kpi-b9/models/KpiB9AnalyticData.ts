import dayjs from 'dayjs/esm';

export class KpiB9AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null;
  stationId: number | null;
  evaluationDate: dayjs.Dayjs | null;
  totRes: number | null;
  resOk: number | null;
  resKoReal: number | null;
  resKoValid: number | null;
  kpiB9DetailResultId: number | null;

  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    stationId: number | null = null,
    evaluationDate: dayjs.Dayjs | null = null,
    totRes: number | null = null,
    resOk: number | null = null,
    resKoReal: number | null = null,
    resKoValid: number | null = null,
    kpiB9DetailResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.stationId = stationId;
    this.evaluationDate = evaluationDate;
    this.totRes = totRes;
    this.resOk = resOk;
    this.resKoReal = resKoReal;
    this.resKoValid = resKoValid;
    this.kpiB9DetailResultId = kpiB9DetailResultId;
  }
}
