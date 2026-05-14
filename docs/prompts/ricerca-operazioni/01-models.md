# Prompt 01 — Modelli TypeScript e Mock

## Contesto

Nel progetto `pagopa-cruscotto-frontend` i modelli delle entità si trovano in `src/main/webapp/app/entity/<nome-entità>/models/`.
Prendere come riferimento il file `src/main/webapp/app/entity/instance/models/instance.model.ts`.

## Obiettivo

Creare il file `src/main/webapp/app/entity/pago-pa/ricerca-operazioni/models/ricerca-operazioni.model.ts`
con le seguenti interfacce TypeScript.

## Interfacce da creare

### Interfacce per la ricerca (risultati lista)

```typescript
/** Riga della tabella dei risultati della ricerca */
export interface IOperazioneRicercaRow {
  /** Codice fiscale della PA Emittente */
  paEmittente: string;
  /** Numero Avviso (NAV) */
  numeroAvviso: string;
  /** Informazioni aggiuntive (label del valore cercato). Presente solo se la ricerca è per "Informazioni Aggiuntive" */
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
```

### Interfacce per il dettaglio posizione

```typescript
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

export interface ITokenDettaglio {
  // ⚠️ INTEGRARE con la struttura dei dati espansi del token (es. pagamenti, ricevute, ecc.)
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

export interface IEventoDettaglio {
  // ⚠️ INTEGRARE con la struttura dei dati espansi dell'evento (es. payload, metadata, ecc.)
  [key: string]: any;
}

/** Dettaglio completo della posizione con tokens ed eventi */
export interface IPosizioneDettaglioFull {
  posizione: IPosizioneDettaglio;
  tokens: IToken[];
  eventi: IEvento[];
}
```

### Tipo discriminante per la modalità di ricerca

```typescript
export type RicercaOperazioniMode = 'nav' | 'iuv' | 'token' | 'cart' | 'extra';
```

## Mock

Creare nello stesso file una costante `MOCK_RICERCA_OPERAZIONI_RESPONSE` di tipo `IOperazioneRicercaResponse`
con almeno 3 righe di dati fittizi per poter testare i componenti prima che le API siano disponibili.

Creare anche una costante `MOCK_POSIZIONE_DETTAGLIO_FULL` di tipo `IPosizioneDettaglioFull`
con almeno 2 tokens e 3 eventi, ciascuno con un `dettaglio` popolato con dati fittizi.

## Note

- Esportare tutti i tipi e le costanti.
- Non aggiungere import non necessari.
