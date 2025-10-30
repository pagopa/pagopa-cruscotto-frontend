import dayjs from 'dayjs/esm';

export interface KpiB1Result {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format for dates
  institutionCount: number | null;
  transactionCount: number | null;
  institutionTolerance: number | null;
  transactionTolerance: number | null;
  evaluationType: string | null; // Assuming it's an enum or string representation
  outcome: OutcomeStatus | null; // Assuming it's an enum or string representation
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
