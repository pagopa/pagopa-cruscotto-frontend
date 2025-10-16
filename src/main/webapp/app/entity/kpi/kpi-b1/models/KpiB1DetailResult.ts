import dayjs from 'dayjs/esm';

export interface KpiB1DetailResult {
  id: number | null;
  instanceId: number | null;
  instanceModuleId: number | null;
  analysisDate: dayjs.Dayjs | null; // ISO string format
  evaluationType: string | null; // Assuming it's a string or enum
  evaluationStartDate: dayjs.Dayjs | null; // ISO string format
  evaluationEndDate: dayjs.Dayjs | null; // ISO string format
  totalInstitutions: number | null;
  institutionDifference: number | null;
  institutionDifferencePercentageEC: number | null;
  totalTransactions: number | null;
  transactionDifference: number | null;
  transactionDifferencePercentage: number | null;
  institutionOutcome: string | null;
  transactionOutcome: string | null;
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
