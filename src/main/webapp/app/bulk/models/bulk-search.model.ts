export interface SearchInstanceDTO {
  id?: string;
  name?: string;
  inputType?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  searchCriteria?: BulkSearchCriteria;
}

export type PaymentOutcome = 'OK' | 'KO' | 'NONE';

// Criteri di ricerca per la creazione di una nuova istanza di analisi massiva.
// Solo i campi effettivamente valorizzati devono essere inviati al backend.
export interface BulkSearchCriteria {
  periodStart?: string;
  periodEnd?: string;
  paymentOutcome?: PaymentOutcome;
  touchpoint?: string;
  paymentMethod?: string;
  amountMin?: number;
  amountMax?: number;
  creditorInstitutionId?: number;
  pspId?: number;
  intermediaryId?: number;
  stationId?: number;
  channelId?: number;
}

export interface ProblemDetailWithCause {
  title?: string;
  status?: number;
  detail?: string;
}

export type BulkLifecycleAction = 'restore' | 'archive' | 'duplicate';

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
