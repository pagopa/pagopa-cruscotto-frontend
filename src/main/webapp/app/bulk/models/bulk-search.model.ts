export interface SearchInstanceDTO {
  id?: string;
  name?: string;
  inputType?: 'FILTER' | 'CSV' | string;
  selectedReports?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  perimeterFilter?: PerimeterFilter;
}

export interface SearchInstanceExecutionDTO {
  id?: string;
  status?: string;
  startedAt?: string;
  endedAt?: string;
  message?: string;
}

export type Statuses = 'DRAFT' | 'READY' | 'RUNNING' | 'EXECUTED' | 'FAILED' | 'ARCHIVED';
export type PaymentOutcome = 'OK' | 'KO' | 'NONE';
export type SelectedReportsValues = 'POSITION' | 'TOKEN' | 'TRANSFER';
export type BulkLifecycleAction = 'RESTORE' | 'archive' | 'DUPLICATE';

export interface PaymentPeriod {
  from?: string;
  to?: string;
}

export interface AmountRange {
  from?: number;
  to?: number;
}

export interface CsvValidationError {
  lineNumber: number;
  column: string;
  message: string;
}

export interface CsvValidationResult {
  valid?: boolean;
  detectedTemplate?: string;
  totalRows?: number;
  validRows?: number;
  invalidRows?: number;
  errors?: CsvValidationError[];
}

// Criteri di ricerca per la creazione di una nuova istanza di analisi massiva.
// Solo i campi effettivamente valorizzati devono essere inviati al backend.
export interface PerimeterFilter {
  paymentPeriod?: PaymentPeriod;
  paymentStatuses?: PaymentOutcome[];
  touchpoints?: string[];
  paymentMethods?: string[];
  amount?: AmountRange;
  creditors?: number[];
  psps?: number[];
  technologicalPartners?: number[];
  channels?: number[];
  stations?: number[];
}

export interface ProblemDetailWithCause {
  title?: string;
  status?: number;
  detail?: string;
}

export interface SortObject {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

export interface PageableObject {
  offset?: number;
  sort?: SortObject;
  paged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  unpaged?: boolean;
}

export interface PageDTO<T> {
  totalPages?: number;
  totalElements?: number;
  size?: number;
  content?: T[];
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  pageable?: PageableObject;
  empty?: boolean;
}

export interface AnagStazione {
  id?: number;
  codice?: string;
}

export interface AnagPsp {
  id?: number;
  codice?: string;
  description?: string;
}

export interface AnagIntermediarioPa {
  id?: number;
  codice?: string;
  description?: string;
}

export interface AnagIntermediarioPsp {
  id?: number;
  codice?: string;
  description?: string;
}

export interface AnagPaEmittente {
  id?: number;
  codice?: string;
  description?: string;
}

export interface AnagCanale {
  id?: number;
  codice?: string;
}

export type PageString = PageDTO<string>;
export type PageAnagStazione = PageDTO<AnagStazione>;
export type PageAnagPsp = PageDTO<AnagPsp>;
export type PageAnagIntermediarioPa = PageDTO<AnagIntermediarioPa>;
export type PageAnagIntermediarioPsp = PageDTO<AnagIntermediarioPsp>;
export type PageAnagPaEmittente = PageDTO<AnagPaEmittente>;
export type PageAnagCanale = PageDTO<AnagCanale>;
