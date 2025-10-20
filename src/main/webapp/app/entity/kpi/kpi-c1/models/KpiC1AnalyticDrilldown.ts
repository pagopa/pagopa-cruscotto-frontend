import dayjs from "dayjs/esm";

export interface IC1PagoPaDrilldown {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  kpiC1AnalyticDataId: number | null;
  analysisDate: Date | null; // ISO string format
  dataDate: Date | null;
  institutionFiscalCode: string | null;
  positionsCount: number | null;
  messagesCount: number | null;
  percentageMessages: number | null;
}