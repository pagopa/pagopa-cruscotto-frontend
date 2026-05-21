// ============================================================
// Modelli applicativi (view-model) per la feature Ricerca Operazioni.
// ============================================================

// ============================================================
// Interfacce di supporto
// ============================================================

export interface IActors {
  psp?: string;
  station?: string;
  channel?: string;
  ptPa?: string;
  ptPsp?: string;
}

export interface IAmount {
  fee?: number;
  amount?: number;
}

export interface IPayed {
  token?: string;
  paymentBorn?: Date;
  payedDate?: Date;
  multiOutcome?: boolean;
}

export interface IPaymentInfo {
  touchpoint?: string;
  paymentMethod?: string;
  isDw?: boolean;
  isGpd?: boolean;
  isStandin?: boolean;
  isCart?: boolean;
}

export interface IPositionInfo {
  nav?: string;
  iuv?: string;
  paEmittente?: string;
  creditorReferenceId?: string;
  lastEvent?: Date;
  isCached?: boolean;
}

export interface IExtraInfoObject {
  nav?: string;
  token?: string;
  name?: string;
  value?: string;
  tipoevento?: string;
  paEmittente?: string;
}

export interface ITransferObject {
  idTransfer?: number;
  iban?: string;
  amount?: number;
  typeTransfer?: string;
  paFiscalCode?: string;
}

export interface IProblemDetail {
  title?: string;
  status?: number;
  detail?: string;
}

export interface IUnifiedSearchResponse {
  results?: Array<{ nav?: string; match?: Array<string>; paEmittente?: string }>;
  count?: number;
}

// ============================================================
// Tipo discriminante per la modalità di ricerca
// ============================================================

export type RicercaOperazioniMode = 'nav' | 'iuv' | 'token' | 'cart' | 'extra';

// ============================================================
// Riga del risultato di ricerca
// ============================================================

/**
 * Riga della tabella dei risultati della ricerca.
 * La chiave logica della posizione è la coppia (nav, paEmittente) — non esiste un positionId
 * lato backend. Manteniamo `positionId` come proprietà derivata per retro-compatibilità
 * della vista lista (è la concatenazione `${paEmittente}_${nav}` URL-safe).
 */
export interface IOperazioneRicercaRow {
  paEmittente: string;
  numeroAvviso: string;
  /** Match delle informazioni aggiuntive, presente solo in modalità "extra". */
  match?: string[] | null;
  /** Identificativo composto (URL-safe) usato per il routing al dettaglio. */
  positionId: string;
}

export interface IOperazioneRicercaResponse {
  content: IOperazioneRicercaRow[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/** Costruisce l'identificativo composto da usare in URL a partire da una riga DTO. */
export const buildPositionId = (paEmittente: string, nav: string): string => `${paEmittente}_${nav}`;

/** Decodifica un identificativo composto nelle sue parti (paEmittente, nav). */
export const parsePositionId = (positionId: string): { paEmittente: string; nav: string } | null => {
  const parts = positionId.split('_');
  if (parts.length !== 2) return null;
  return { paEmittente: parts[0], nav: parts[1] };
};

/** Converte un elemento della risposta di ricerca in una riga della tabella. */
export const toOperazioneRicercaRow = (dto: { nav?: string; match?: Array<string>; paEmittente?: string }): IOperazioneRicercaRow => ({
  paEmittente: dto.paEmittente ?? '',
  numeroAvviso: dto.nav ?? '',
  match: dto.match ?? null,
  positionId: buildPositionId(dto.paEmittente ?? '', dto.nav ?? ''),
});

// ============================================================
// Dettaglio posizione (vista centrale)
// ============================================================

/** Posizione debitoria. */
export interface IPosizione {
  tokens?: number;
  payed?: IPayed;
  actors?: IActors;
  amount?: IAmount;
  positionInfo?: IPositionInfo;
  allTokens?: Array<string>;
  paymentInfo?: IPaymentInfo;
}

/** Dato espanso di un token (informazioni di pagamento). */
export interface ITokenInfo {
  payed?: IPayed;
  actors?: IActors;
  amount?: IAmount;
  positionInfo?: IPositionInfo;
  isPayedToken?: boolean;
  paymentInfo?: IPaymentInfo;
}

/** Informazioni aggiuntive associate a un token. */
export interface IExtraInfo {
  count?: number;
  results?: Array<IExtraInfoObject>;
}

/** Transfer associati a un token. */
export interface ITransfers {
  token?: string;
  transfers?: ITransferObject;
  positionInfo?: IPositionInfo;
  transfersCount?: number;
}

/** Risposta workflow (eventi posizione + eventi token). */
export interface IWorkflows {
  count?: number;
  eventsPosition?: Array<IWorkflowEvent>;
  eventsToken?: Array<IWorkflowTokenEvent>;
}

export interface IWorkflowEvent {
  insertedtimestamp?: Date;
  tipoevento?: string;
  sottotipoevento?: string;
  outcome?: string;
  faultcode?: string;
  eventId?: string;
}

export interface IWorkflowTokenEvent {
  insertedtimestamp?: Date;
  tipoevento?: string;
  sottotipoevento?: string;
  outcome?: string;
  faultcode?: string;
  token?: string;
  eventId?: string;
}

/**
 * Riga della tabella Tokens nella vista di dettaglio.
 * Ogni riga rappresenta un token associato alla posizione.
 * Le tre sotto-sezioni espandibili (info, transfers, extra) vengono caricate on-demand.
 */
export interface ITokenRow {
  token: string;
  /** Sezione "Dettaglio Token" caricata on-demand. */
  info?: ITokenInfo | null;
  /** Sezione "Transfers" caricata on-demand. */
  transfers?: ITransfers | null;
  /** Sezione "Informazioni Aggiuntive" caricata on-demand. */
  extra?: IExtraInfo | null;
}

/**
 * Riga della tabella Eventi (workflow di posizione + token).
 * Internamente i dati provengono dall'unione di IWorkflowEvent[] (eventsPosition) e
 * IWorkflowTokenEvent[] (eventsToken); il campo `token` è valorizzato solo per gli eventi token.
 */
export interface IEventoRow extends IWorkflowEvent {
  /** ID univoco di riga (eventId o indice). */
  rowId: string;
  /** Presente solo se l'evento è associato a un token (eventsToken). */
  token?: string;
}
