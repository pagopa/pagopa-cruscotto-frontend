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

// ============================================================
// Tipi raw (JSON) — cruscotto-sert-backend
// Le chiavi rispecchiano esattamente la serializzazione Jackson
// (con @JsonProperty kebab-case). Non usare questi tipi fuori
// dal layer API client e dai mapper qui sotto.
// ============================================================

export interface IRawBasicPosition {
  nav?: string;
  'pa-emittente'?: string;
}

export interface IRawPositionPaymentInfo extends IRawBasicPosition {
  iuv?: string;
  'creditor-reference-id'?: string;
  /** ISO-8601 Instant come stringa. */
  'last-event'?: string;
  'is-cached'?: boolean;
}

export interface IRawActors {
  psp?: string;
  'pt-pa'?: string;
  'pt-psp'?: string;
  station?: string;
  channel?: string;
}

export interface IRawPayed {
  token?: string;
  'payment-born'?: string;
  'payed-date'?: string;
  'multi-outcome'?: boolean;
}

export interface IRawPaymentInfo {
  touchpoint?: string;
  'payment-method'?: string;
  'is-dw'?: boolean;
  'is-gpd'?: boolean;
  'is-standin'?: boolean;
  'is-cart'?: boolean;
}

export interface IRawUnifiedSearchResponse {
  results?: Array<IRawBasicPosition & { match?: string[] }>;
  count?: number;
}

export interface IRawPositionPayment {
  'position-info'?: IRawPositionPaymentInfo;
  tokens?: number;
  'all-tokens'?: string[];
  payed?: IRawPayed;
  actors?: IRawActors;
  amount?: IAmount;
  'payment-info'?: IRawPaymentInfo;
}

export interface IRawTokenInfo {
  'position-info'?: IRawPositionPaymentInfo;
  'is-payed-token'?: boolean;
  payed?: IRawPayed;
  actors?: IRawActors;
  amount?: IAmount;
  'payment-info'?: IRawPaymentInfo;
}

export interface IRawTransferObject {
  idTransfer?: number;
  'type-transfer'?: string;
  iban?: string;
  amount?: number;
  'pa-fiscal-code'?: string;
}

export interface IRawTransferPayment {
  'position-info'?: IRawPositionPaymentInfo;
  token?: string;
  'transfers-count'?: number;
  transfers?: IRawTransferObject;
}

export interface IRawWorkflowEvent {
  insertedtimestamp?: string;
  tipoevento?: string;
  sottotipoevento?: string;
  outcome?: string;
  faultcode?: string;
  'event-id'?: string;
}

export interface IRawWorkflowTokenEvent extends IRawWorkflowEvent {
  token?: string;
}

export interface IRawWorkflowResponse {
  count?: number;
  'events-position'?: IRawWorkflowEvent[];
  'events-token'?: IRawWorkflowTokenEvent[];
}

export interface IRawExtraInfoObject extends IRawBasicPosition {
  token?: string;
  name?: string;
  value?: string;
  tipoevento?: string;
}

export interface IRawExtraInfoResponse {
  count?: number;
  results?: IRawExtraInfoObject[];
}

// ============================================================
// Mapper: raw JSON → view-model (camelCase)
// ============================================================

const mapRawPositionInfo = (raw?: IRawPositionPaymentInfo): IPositionInfo | undefined =>
  raw
    ? {
        nav: raw.nav,
        paEmittente: raw['pa-emittente'],
        iuv: raw.iuv,
        creditorReferenceId: raw['creditor-reference-id'],
        lastEvent: raw['last-event'] ? new Date(raw['last-event']) : undefined,
        isCached: raw['is-cached'],
      }
    : undefined;

const mapRawActors = (raw?: IRawActors): IActors | undefined =>
  raw
    ? {
        psp: raw.psp,
        ptPa: raw['pt-pa'],
        ptPsp: raw['pt-psp'],
        station: raw.station,
        channel: raw.channel,
      }
    : undefined;

const mapRawPayed = (raw?: IRawPayed): IPayed | undefined =>
  raw
    ? {
        token: raw.token,
        paymentBorn: raw['payment-born'] ? new Date(raw['payment-born']) : undefined,
        payedDate: raw['payed-date'] ? new Date(raw['payed-date']) : undefined,
        multiOutcome: raw['multi-outcome'],
      }
    : undefined;

const mapRawPaymentInfo = (raw?: IRawPaymentInfo): IPaymentInfo | undefined =>
  raw
    ? {
        touchpoint: raw.touchpoint,
        paymentMethod: raw['payment-method'],
        isDw: raw['is-dw'],
        isGpd: raw['is-gpd'],
        isStandin: raw['is-standin'],
        isCart: raw['is-cart'],
      }
    : undefined;

export const mapRawPosizione = (raw: IRawPositionPayment): IPosizione => ({
  positionInfo: mapRawPositionInfo(raw['position-info']),
  tokens: raw.tokens,
  allTokens: raw['all-tokens'],
  payed: mapRawPayed(raw.payed),
  actors: mapRawActors(raw.actors),
  amount: raw.amount,
  paymentInfo: mapRawPaymentInfo(raw['payment-info']),
});

export const mapRawTokenInfo = (raw: IRawTokenInfo): ITokenInfo => ({
  positionInfo: mapRawPositionInfo(raw['position-info']),
  isPayedToken: raw['is-payed-token'],
  payed: mapRawPayed(raw.payed),
  actors: mapRawActors(raw.actors),
  amount: raw.amount,
  paymentInfo: mapRawPaymentInfo(raw['payment-info']),
});

export const mapRawTransfers = (raw: IRawTransferPayment): ITransfers => ({
  positionInfo: mapRawPositionInfo(raw['position-info']),
  token: raw.token,
  transfersCount: raw['transfers-count'],
  transfers: raw.transfers
    ? {
        idTransfer: raw.transfers.idTransfer,
        typeTransfer: raw.transfers['type-transfer'],
        iban: raw.transfers.iban,
        amount: raw.transfers.amount,
        paFiscalCode: raw.transfers['pa-fiscal-code'],
      }
    : undefined,
});

export const mapRawWorkflows = (raw: IRawWorkflowResponse): IWorkflows => ({
  count: raw.count,
  eventsPosition: (raw['events-position'] ?? []).map(e => ({
    insertedtimestamp: e.insertedtimestamp ? new Date(e.insertedtimestamp) : undefined,
    tipoevento: e.tipoevento,
    sottotipoevento: e.sottotipoevento,
    outcome: e.outcome,
    faultcode: e.faultcode,
    eventId: e['event-id'],
  })),
  eventsToken: (raw['events-token'] ?? []).map(e => ({
    insertedtimestamp: e.insertedtimestamp ? new Date(e.insertedtimestamp) : undefined,
    tipoevento: e.tipoevento,
    sottotipoevento: e.sottotipoevento,
    outcome: e.outcome,
    faultcode: e.faultcode,
    eventId: e['event-id'],
    token: e.token,
  })),
});

export const mapRawExtraInfo = (raw: IRawExtraInfoResponse): IExtraInfo => ({
  count: raw.count,
  results: (raw.results ?? []).map(r => ({
    nav: r.nav,
    paEmittente: r['pa-emittente'],
    token: r.token,
    name: r.name,
    value: r.value,
    tipoevento: r.tipoevento,
  })),
});
