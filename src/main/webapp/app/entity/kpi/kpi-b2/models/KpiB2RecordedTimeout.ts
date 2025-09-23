import dayjs from 'dayjs/esm';

export class KpiB2RecordedTimeout {
  id: number | null;
  cfPartner: string | null;
  station: string | null;
  method: string | null;
  startDate: dayjs.Dayjs | null; //ISO
  endDate: dayjs.Dayjs | null; //ISO
  totReq: number | null;
  reqOk: number | null;
  reqTimeout: number | null;
  avgTime: number | null;

  constructor(
    id: number | null = null,
    cfPartner: string | null = null,
    station: string | null = null,
    method: string | null = null,
    startDate: dayjs.Dayjs | null = null,
    endDate: dayjs.Dayjs | null = null,
    totReq: number | null = null,
    reqOk: number | null = null,
    reqTimeout: number | null = null,
    avgTime: number | null = null,
  ) {
    this.id = id;
    this.cfPartner = cfPartner;
    this.station = station;
    this.method = method;
    this.startDate = startDate;
    this.endDate = endDate;
    this.totReq = totReq;
    this.reqOk = reqOk;
    this.reqTimeout = reqTimeout;
    this.avgTime = avgTime;
  }
}

export interface KpiB2RecordedTimeoutRequest {
  cfPartner?: number;
  station?: string;
  method?: string;
  day?: Date;
  page?: number;
  size?: number;
  sort?: string[];
}
