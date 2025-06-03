import dayjs from 'dayjs/esm';

export class KpiB9AnalyticData {
  coId: number | null;
  coInstanceId: number | null;
  coInstanceModuleId: number | null;
  dtAnalisysDate: dayjs.Dayjs | null;
  coStationId: number | null;
  dtEvaluationDate: dayjs.Dayjs | null;
  coTotRes: number | null;
  coResOk: number | null;
  coResKoReal: number | null;
  coResKoValid: number | null;
  coKpiB9DetailResultId: number | null;

  constructor(
    coId: number | null = null,
    coInstanceId: number | null = null,
    coInstanceModuleId: number | null = null,
    dtAnalisysDate: dayjs.Dayjs | null = null,
    coStationId: number | null = null,
    dtEvaluationDate: dayjs.Dayjs | null = null,
    coTotRes: number | null = null,
    coResOk: number | null = null,
    coResKoReal: number | null = null,
    coResKoValid: number | null = null,
    coKpiB9DetailResultId: number | null = null,
  ) {
    this.coId = coId;
    this.coInstanceId = coInstanceId;
    this.coInstanceModuleId = coInstanceModuleId;
    this.dtAnalisysDate = dtAnalisysDate;
    this.coStationId = coStationId;
    this.dtEvaluationDate = dtEvaluationDate;
    this.coTotRes = coTotRes;
    this.coResOk = coResOk;
    this.coResKoReal = coResKoReal;
    this.coResKoValid = coResKoValid;
    this.coKpiB9DetailResultId = coKpiB9DetailResultId;
  }
}
