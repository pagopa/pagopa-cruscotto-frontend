// ============================================================
// Tipo discriminante per la modalità di ricerca
// ============================================================

export type RicercaOperazioniMode = 'nav' | 'iuv' | 'token' | 'cart' | 'extra';

// ============================================================
// Interfacce per la ricerca (risultati lista)
// ============================================================

/** Riga della tabella dei risultati della ricerca */
export interface IOperazioneRicercaRow {
  /** Codice fiscale della PA Emittente */
  paEmittente: string;
  /** Numero Avviso (NAV) */
  numeroAvviso: string;
  /** Informazioni aggiuntive (label del valore cercato). Presente solo se ricerca per "extra" */
  match?: string[] | null;
  /** Identificativo univoco della posizione, usato per navigare al dettaglio */
  positionId: string;
}

export interface IOperazioneRicercaResponse {
  content: IOperazioneRicercaRow[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ============================================================
// Interfacce per il dettaglio posizione
// ============================================================

/** Dettaglio di una posizione */
export interface IPosizioneDettaglio {
  positionId: string;
  paEmittente: string;
  numeroAvviso: string;
  iuv?: string | null;
  importo?: number | null;
  descrizione?: string | null;
  // ⚠️ INTEGRARE con i campi aggiuntivi restituiti dall'API di dettaglio posizione
}

/** Dati espansi del dettaglio di un token */
export interface ITokenDettaglio {
  // ⚠️ INTEGRARE con la struttura dei dati espansi del token
  [key: string]: any;
}

/** Riga della tabella Tokens */
export interface IToken {
  token: string;
  importo?: number | null;
  stato?: string | null;
  dataCreazione?: string | null;
  // ⚠️ INTEGRARE con i campi aggiuntivi restituiti dall'API Tokens
  /** Dati espansi caricati al click su "Espandi". Null finché non espanso. */
  dettaglio?: ITokenDettaglio | null;
}

/** Dati espansi del dettaglio di un evento */
export interface IEventoDettaglio {
  // ⚠️ INTEGRARE con la struttura dei dati espansi dell'evento
  [key: string]: any;
}

/** Riga della tabella Eventi */
export interface IEvento {
  eventoId: string;
  tipo?: string | null;
  dataEvento?: string | null;
  stato?: string | null;
  // ⚠️ INTEGRARE con i campi aggiuntivi restituiti dall'API Eventi
  /** Dati espansi caricati al click su "Espandi". Null finché non espanso. */
  dettaglio?: IEventoDettaglio | null;
}

/** Dettaglio completo della posizione con tokens ed eventi */
export interface IPosizioneDettaglioFull {
  posizione: IPosizioneDettaglio;
  tokens: IToken[];
  eventi: IEvento[];
}

// ============================================================
// Mock dati — da rimuovere quando le API sono disponibili
// ============================================================

export const MOCK_RICERCA_OPERAZIONI_RESPONSE: IOperazioneRicercaResponse = {
  content: [
    {
      positionId: 'POS-001',
      paEmittente: '01234567890',
      numeroAvviso: '302000000000000001',
      match: ['label-info-1', 'label-info-2'],
    },
    {
      positionId: 'POS-002',
      paEmittente: '09876543210',
      numeroAvviso: '302000000000000002',
      match: ['label-info-3'],
    },
    {
      positionId: 'POS-003',
      paEmittente: '01234567890',
      numeroAvviso: '302000000000000003',
      match: null,
    },
  ],
  totalElements: 3,
  totalPages: 1,
  size: 10,
  number: 0,
};

export const MOCK_POSIZIONE_DETTAGLIO_FULL: IPosizioneDettaglioFull = {
  posizione: {
    positionId: 'POS-001',
    paEmittente: '01234567890',
    numeroAvviso: '302000000000000001',
    iuv: 'IUV-0000001',
    importo: 150.0,
    descrizione: 'Pagamento tasse scolastiche',
  },
  tokens: [
    {
      token: 'TOKEN-ABC-001',
      importo: 150.0,
      stato: 'PAGATO',
      dataCreazione: '2024-01-15T10:30:00',
      dettaglio: null,
    },
    {
      token: 'TOKEN-ABC-002',
      importo: 150.0,
      stato: 'ANNULLATO',
      dataCreazione: '2024-01-10T08:00:00',
      dettaglio: null,
    },
  ],
  eventi: [
    {
      eventoId: 'EVT-001',
      tipo: 'PAGAMENTO_RICEVUTO',
      dataEvento: '2024-01-15T10:31:00',
      stato: 'OK',
      dettaglio: null,
    },
    {
      eventoId: 'EVT-002',
      tipo: 'NOTIFICA_INVIATA',
      dataEvento: '2024-01-15T10:35:00',
      stato: 'OK',
      dettaglio: null,
    },
    {
      eventoId: 'EVT-003',
      tipo: 'ANNULLAMENTO',
      dataEvento: '2024-01-10T08:05:00',
      stato: 'OK',
      dettaglio: null,
    },
  ],
};

export const MOCK_TOKEN_DETTAGLIO: ITokenDettaglio = {
  // ⚠️ INTEGRARE con i campi reali
  pagamenti: [{ id: 'PAG-001', importo: 150.0, data: '2024-01-15T10:30:00', esito: 'OK' }],
  ricevuta: { iur: 'IUR-0000001', dataRicezione: '2024-01-15T10:30:05' },
};

export const MOCK_EVENTO_DETTAGLIO: IEventoDettaglio = {
  // ⚠️ INTEGRARE con i campi reali
  payload: '{"tipo":"PAGAMENTO_RICEVUTO","importo":150.0}',
  metadata: { source: 'NODO', correlationId: 'CORR-001' },
};
