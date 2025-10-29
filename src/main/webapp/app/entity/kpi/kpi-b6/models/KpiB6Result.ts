import dayjs from 'dayjs/esm';

export interface KpiB6Result {
  id: number | null;
  moduleCode: string | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null;
  outcome: OutcomeStatus | null;
  additionalData: AdditionalData | null;
  createdBy: string | null;
  createdDate: string | null;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
}

export interface AdditionalData {
  totalActiveStations: number;
  stationsWithPaymentOptions: number;
  paymentOptionsPercentage: number;
  toleranceThreshold: number;
  evaluationType: string;
}

// Enum di EvaluationType
export enum EvaluationType {
  MESE = 'MESE',
  TOTALE = 'TOTALE',
}

// Enum di OutcomeStatus
export enum OutcomeStatus {
  OK = 'OK',
  KO = 'KO',
  RUNNING = 'RUNNING',
  STANDBY = 'STANDBY',
}
