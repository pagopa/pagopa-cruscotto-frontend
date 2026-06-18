# Prompt 07 — Componente Lista (Filtri + Tabella Risultati)

## Contesto

Prendere come riferimento visivo e strutturale:

- `src/main/webapp/app/entity/pago-pa/payment-receipt/list/payment-receipt.component.ts`
- `src/main/webapp/app/entity/pago-pa/payment-receipt/list/payment-receipt.component.html`
- `src/main/webapp/app/entity/instance/list/instance.component.ts` per la gestione
  dei form reattivi, della paginazione e dello spinner.

## Obiettivo

Creare i file:

1. `src/main/webapp/app/entity/pago-pa/ricerca-operazioni/list/ricerca-operazioni.component.ts`
2. `src/main/webapp/app/entity/pago-pa/ricerca-operazioni/list/ricerca-operazioni.component.html`
3. `src/main/webapp/app/entity/pago-pa/ricerca-operazioni/list/ricerca-operazioni.component.scss`

---

## TypeScript — `ricerca-operazioni.component.ts`

### Imports da includere

Stessi pattern di `payment-receipt.component.ts` più:

- `MatRadioModule` da `@angular/material/radio` (per il gruppo esclusivo di campi)
- `Validators` da `@angular/forms`
- Il service `RicercaOperazioniService` (Prompt 04)
- Il filter `RicercaOperazioniFilter` (Prompt 05)
- I tipi `IOperazioneRicercaRow`, `IOperazioneRicercaResponse`, `RicercaOperazioniMode`
  dal model (Prompt 01)

### Proprietà del componente

```typescript
displayedColumns: string[] = ['paEmittente', 'numeroAvviso', 'infoAggiuntive', 'action'];

/** I campi esclusivi. Solo uno può essere valorizzato alla volta. */
exclusiveModes: RicercaOperazioniMode[] = ['nav', 'iuv', 'token', 'cart', 'extra'];

data: IOperazioneRicercaRow[] = [];
resultsLength = 0;
itemsPerPage = ITEMS_PER_PAGE;
page!: number;
_search = false;
isLoadingResults = false;
```

### Form reattivo

Il `searchForm` deve avere i seguenti controlli:

- `paEmittente` — `FormControl<string>`, facoltativo, validazione: se valorizzato deve avere esattamente 11 caratteri numerici (suggerire `Validators.pattern(/^\d{11}$/)`)
- `nav` — `FormControl<string>`, facoltativo
- `iuv` — `FormControl<string>`, facoltativo
- `token` — `FormControl<string>`, facoltativo
- `idCarrello` — `FormControl<string>`, facoltativo
- `extra` — `FormControl<string>`, facoltativo

### Validazione form esclusività

Aggiungere un `validator` a livello di form group che verifichi che **esattamente uno**
tra `nav`, `iuv`, `token`, `idCarrello`, `extra` sia valorizzato.
Se nessuno è valorizzato o più di uno è valorizzato, impostare `{ exclusiveFieldRequired: true }` come errore del form group.

### Logica al cambio campo esclusivo

Quando l'utente inizia a digitare in uno dei campi esclusivi, pulire automaticamente
gli altri 4 campi esclusivi (ma non `paEmittente`).
Implementare questa logica tramite `valueChanges` sulle singole `FormControl`.

### Metodo `search()`

1. Determinare quale campo esclusivo è valorizzato → impostare `filter.mode`.
2. Chiamare il metodo corrispondente del service in base al `mode`.
3. Gestire la risposta popolando `data` e `resultsLength`.
4. Mostrare/nascondere lo spinner con `NgxSpinnerService`.
5. La colonna `infoAggiuntive` deve essere visibile SOLO se `filter.mode === 'extra'`;
   aggiornare `displayedColumns` di conseguenza.

### Metodo `clear()`

Resettare il form, il filter, `data` e `_search`.

---

## HTML — `ricerca-operazioni.component.html`

### Struttura generale

Replicare la struttura di `payment-receipt.component.html`:

1. Header con titolo (`pagopaCruscottoApp.ricercaOperazioni.home.title`) e bottone "Back".
2. `<form>` con `mat-accordion` / `mat-expansion-panel` per i filtri.
3. Card risultati (nascosta finché `_search` è false, con messaggio "Applica un filtro").
4. Card risultati (visibile quando `_search` è true) con spinner, paginazione e tabella.

### Sezione filtri (dentro `mat-expansion-panel`)

Layout a griglia Bootstrap (col-lg-\*):

**Riga 1:**

- `col-lg-3`: Campo `paEmittente` (mat-form-field, input text, label da i18n, hint "Facoltativo — 11 cifre")

**Separatore visivo / hint testo:**

- Testo informativo sull'esclusività (chiave i18n `pagopaCruscottoApp.ricercaOperazioni.filter.exclusiveHint`)

**Riga 2 — campi esclusivi:**

- `col-lg-3`: Campo `nav` (mat-form-field, input text)
- `col-lg-3`: Campo `iuv` (mat-form-field, input text)
- `col-lg-3`: Campo `token` (mat-form-field, input text)

**Riga 3 — campi esclusivi (continua):**

- `col-lg-3`: Campo `idCarrello` (mat-form-field, input text)
- `col-lg-3`: Campo `extra` (mat-form-field, input text)

**mat-action-row:**

- Bottone "Cerca" (`type="submit"`, disabilitato se `searchForm.invalid || isLoadingResults`)
- Bottone "Pulisci" (`type="button"`, chiama `clear()`)

### Tabella risultati

Colonne:

- `paEmittente` — testo
- `numeroAvviso` — testo
- `infoAggiuntive` — `*ngIf="filter.mode === 'extra'"`, mostra `row.match?.join(', ')`
- `action` — bottone link/icona che naviga a `['/entity/pago-pa/ricerca-operazioni', row.positionId, 'view']`
  con tooltip (chiave `pagopaCruscottoApp.ricercaOperazioni.result.detail`)
  e icona `open_in_new` (material-symbols-outlined)

Includere paginazione `mat-paginator` e ordinamento `mat-sort` come nei componenti di riferimento.

---

## SCSS — `ricerca-operazioni.component.scss`

File vuoto o con override minimali coerenti con gli altri componenti (lasciare vuoto se non necessario).

---

## ⚠️ Note

- Il messaggio di hint per il form va inserito con `<mat-hint>` o `<p>` con classe `text-muted small`.
- L'errore di esclusività del form group va visualizzato con `<mat-error>` o un `<div>` di alert
  sotto la riga dei campi esclusivi, solo se il form è stato "touched".
