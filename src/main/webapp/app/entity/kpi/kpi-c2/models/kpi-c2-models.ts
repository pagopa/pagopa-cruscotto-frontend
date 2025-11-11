import dayjs from 'dayjs/esm';

export interface KpiC2Result {
  id?: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null;
  eligibilityThreshold: number | null;
  tolerance: number | null;
  evaluationType: EvaluationType | null;
  outcome: OutcomeStatus | null;
  institutionTolerance: number | null;
  notificationTolerance: number | null;
}

export interface KpiC2DetailResult {
  id?: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  kpiC2ResultId: number | null;
  analysisDate: dayjs.Dayjs | null;
  evaluationType: EvaluationType | null;
  evaluationStartDate: dayjs.Dayjs | null;
  evaluationEndDate: dayjs.Dayjs | null;
  totalInstitution: number | null;
  totalInstitutionSend: number | null;
  percentInstitutionSend: number | null;
  totalPayment: number | null;
  totalNotification: number | null;
  percentEntiOk: number | null;
  outcome: OutcomeStatus | null;
}

export interface KpiC2AnalyticData {
  id?: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  stationId: number | null;
  kpiC2DetailResultId: number | null;
  analysisDate: dayjs.Dayjs | null;
  dataDate: dayjs.Dayjs | null;
  numInstitution: number | null;
  numInstitutionSend: number | null;
  perInstitutionSend: number | null;
  numPayment: number | null;
  numNotification: number | null;
  perNotification: number | null;
}

export interface KpiC2AnalyticDrillDown {
  id?: number | null;
  instanceId: number | null;
  kpiC2AnalyticDataId?: number | null;
  analysisDate: dayjs.Dayjs | null;
  dataDate: dayjs.Dayjs | null;
  institutionFiscalCode: string | null;
  totalPayments: number | null;
  totalNotifications: number | null;
  percentageNotifications: number | null;
}

// Enum di OutcomeStatus
export enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
  RUNNING = 'RUNNING',
  STANDBY = 'STANDBY',
}

// Enum di EvaluationType
export enum EvaluationType {
  MESE = 'MESE',
  TOTALE = 'TOTALE',
}
