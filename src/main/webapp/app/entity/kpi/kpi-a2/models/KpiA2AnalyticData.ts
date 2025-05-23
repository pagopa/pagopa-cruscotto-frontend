import dayjs from 'dayjs/esm';

export class KpiA2AnalyticData {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format for date
  evaluationDate: dayjs.Dayjs | null; // ISO string format for date
  totPayments: number | null;
  totIncorrectPayments: number | null;
  kpiA2DetailResultId: number | null;

  // Costruttore
  constructor(
    id: number | null = null,
    instanceId: number | null = null,
    instanceModuleId: number | null = null,
    analysisDate: dayjs.Dayjs | null = null,
    evaluationDate: dayjs.Dayjs | null = null,
    totPayments: number | null = null,
    totIncorrectPayments: number | null = null,
    kpiA2DetailResultId: number | null = null,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    this.instanceModuleId = instanceModuleId;
    this.analysisDate = analysisDate;
    this.evaluationDate = evaluationDate;
    this.totPayments = totPayments;
    this.totIncorrectPayments = totIncorrectPayments;
    this.kpiA2DetailResultId = kpiA2DetailResultId;
  }
}
