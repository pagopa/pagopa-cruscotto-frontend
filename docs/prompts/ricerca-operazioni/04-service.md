# Prompt 04 — Service Angular

## Contesto

I servizi si trovano in `src/main/webapp/app/entity/<nome-entità>/service/`.
Prendere come riferimento `src/main/webapp/app/entity/instance/service/instance.service.ts`
per la struttura del servizio (inject di `HttpClient`, `ApplicationConfigService`, `Observable`, ecc.).

I modelli necessari sono stati creati nel Prompt 01:
`src/main/webapp/app/entity/pago-pa/ricerca-operazioni/models/ricerca-operazioni.model.ts`

## Obiettivo

Creare il file:
`src/main/webapp/app/entity/pago-pa/ricerca-operazioni/service/ricerca-operazioni.service.ts`

## Struttura del Service

Il service deve esporre i seguenti metodi. **In questa fase usare i mock** importati da
`../models/ricerca-operazioni.model.ts` invece di chiamate HTTP reali,
restituendo `of(mock)` con `delay(300)` per simulare la latenza.

### Metodi di ricerca (lista)

Ogni metodo accetta un parametro opzionale `paEmittente?: string` e un oggetto di paginazione
`{ page: number; size: number; sort?: string }` e restituisce
`Observable<HttpResponse<IOperazioneRicercaResponse>>`.

```typescript
/** GET /search/{nav} — Ricerca per Codice Avviso */
searchByNav(nav: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>>

/** GET /search/{iuv} — Ricerca per IUV o Creditor Reference ID */
searchByIuv(iuv: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>>

/** GET /search/{token} — Ricerca per token */
searchByToken(token: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>>

/** GET /search/cart/{id_cart} — Ricerca per ID Carrello */
searchByCart(idCart: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>>

/** GET /search/extra/{searchValue} — Ricerca per Informazioni Aggiuntive */
searchByExtra(searchValue: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>>
```

### Metodo di dettaglio posizione

```typescript
/** GET /position/{positionId} — Dettaglio posizione con tokens ed eventi */
getPosizioneDettaglio(positionId: string): Observable<HttpResponse<IPosizioneDettaglioFull>>
```

### Metodi per l'expand delle righe

```typescript
/** Carica il dettaglio espanso di un token */
getTokenDettaglio(token: string): Observable<ITokenDettaglio>

/** Carica il dettaglio espanso di un evento */
getEventoDettaglio(eventoId: string): Observable<IEventoDettaglio>
```

## Implementazione Mock

- Usare `of(...)` da `rxjs` e `delay` da `rxjs/operators` per simulare le chiamate HTTP.
- Per i metodi che restituiscono `HttpResponse`, costruire con `new HttpResponse({ body: mock, status: 200 })`.
- Includere i `TODO` con i commenti per indicare dove sostituire la chiamata mock con la vera `this.http.get(...)`.

## ⚠️ Note

- Gli URL base delle API sono da integrare:
  - **⚠️ INTEGRARE il base path delle API di ricerca operazioni** (es. `api/ricerca-operazioni` o il path reale esposto dal backend).
- Usare `ApplicationConfigService.getEndpointFor(...)` per costruire i resource URL, coerentemente con gli altri servizi del progetto.
- Una volta che le API sono disponibili, rimuovere i mock e sostituire con le chiamate HTTP reali.
