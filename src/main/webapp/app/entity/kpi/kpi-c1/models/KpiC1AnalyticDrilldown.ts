import dayjs from 'dayjs/esm';

export interface IC1IODrilldown {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analyticDataId: number | null;
  referenceDate: Date | null; // ISO string format
  dataDate: Date | null;
  cfInstitution: string | null;
  cfPartner: string | null;
  positionsCount: number | null;
  messagesCount: number | null;
  percentage: number | null;
  meetsTolerance: boolean;
}
