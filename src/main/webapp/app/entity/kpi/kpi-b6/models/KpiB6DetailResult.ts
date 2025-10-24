import dayjs from 'dayjs/esm';

export interface KpiB6DetailResult {
  id: number; // int64
  instanceId: number; // int64
  instanceModuleId: number; // int64
  anagStationId: number; // int64
  kpiB6ResultId: number; // int64
  analysisDate: string; // date
  totalStations: number; // int32
  stationsWithPaymentOptions: number; // int32
  difference: number; // int32
  percentageDifference: number; // double
  outcome: 'OK' | 'KO'; // enum
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
