export interface SearchInstanceDTO {
  id?: string;
  name?: string;
  inputType?: 'FILTER' | 'CSV' | string;
  selectedReports?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  presentCsv?: boolean;
  perimeterFilter?: PerimeterFilter;
}

export interface SearchInstancePOSTDTO {
  id?: string;
  name?: string;
  inputType?: 'FILTER' | 'CSV' | string;
  selectedReports?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  presentCsv?: boolean;
  perimeterFilter?: PerimeterFilterPOSTDTO;
}

export interface SearchInstanceExecutionDTO {
  id?: string;
  instanceId?: string;
  status?: string;
  completedAt?: string;
  createdAt?: string;
  errorCode?: string;
  errorMessage?: string;
  generatedFiles?: number;
  processedRows?: number;
  totalInputRows?: number;
  updatedAt?: string;
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
  exact?: number;
  min?: number;
  max?: number;
}

export interface CsvValidationError {
  lineNumber: number;
  column: string | null;
  codeMessage: string;
  message: string;
  expected?: number | string;
  found?: number | string;
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
  touchpoints?: LookupOption[];
  paymentMethods?: LookupOption[];
  amount?: AmountRange;
  creditors?: LookupOption[];
  psps?: LookupOption[];
  channels?: LookupOption[];
  stations?: LookupOption[];
  technologicalPartnersPa?: LookupOption[];
  technologicalPartnersPsp?: LookupOption[];
}
export interface PerimeterFilterPOSTDTO {
  paymentPeriod?: PaymentPeriod;
  paymentStatuses?: PaymentOutcome[];
  touchpoints?: string[];
  paymentMethods?: string[];
  amount?: AmountRange;
  creditors?: number[];
  psps?: number[];
  channels?: number[];
  stations?: number[];
  technologicalPartnersPa?: number[];
  technologicalPartnersPsp?: number[];
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

export interface LookupOption {
  id?: number;
  codice?: string;
  description?: string;
}

export type PageString = PageDTO<string>;
export type PageLookupOption = PageDTO<LookupOption>;
