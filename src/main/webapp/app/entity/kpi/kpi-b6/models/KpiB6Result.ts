import dayjs from 'dayjs/esm';

export interface KpiB6Result {
  id: number; // int64
  instanceId: number; // int64
  instanceModuleId: number; // int64
  analysisDate: string; // date
  tolerance: number; // double
  outcome: 'OK' | 'KO'; // enum
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
