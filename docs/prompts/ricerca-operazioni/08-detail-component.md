# Prompt 08 — Componente Dettaglio Posizione

## Contesto

Prendere come riferimento:

- `src/main/webapp/app/entity/instance/detail/instance-detail.component.ts` (struttura TAB con `MatTabNav`).
- I modelli `IPosizioneDettaglioFull`, `IToken`, `IEvento`, `ITokenDettaglio`, `IEventoDettaglio`
  creati nel Prompt 01.
- Il service `RicercaOperazioniService` creato nel Prompt 04.

## Obiettivo

Creare i file:

1. `src/main/webapp/app/entity/pago-pa/ricerca-operazioni/detail/ricerca-operazioni-detail.component.ts`
2. `src/main/webapp/app/entity/pago-pa/ricerca-operazioni/detail/ricerca-operazioni-detail.component.html`
3. `src/main/webapp/app/entity/pago-pa/ricerca-operazioni/detail/ricerca-operazioni-detail.component.scss`

---

## TypeScript — `ricerca-operazioni-detail.component.ts`

### Struttura del componente

```typescript
@Component({
  selector: 'jhi-ricerca-operazioni-detail',
  standalone: true,
  // ... imports necessari
})
export class RicercaOperazioniDetailComponent implements OnInit {
  positionId: string | null = null;
  dettaglio: IPosizioneDettaglioFull | null = null;
  isLoading = true;

  // Dati delle due tabelle
  tokensData: IToken[] = [];
  eventiData: IEvento[] = [];

  // Colonne tabelle
  tokensColumns: string[] = ['token', 'importo', 'stato', 'dataCreazione', 'expand'];
  eventiColumns: string[] = ['eventoId', 'tipo', 'dataEvento', 'stato', 'expand'];

  // Map per tenere traccia delle righe espanse
  expandedTokens = new Set<string>();
  expandedEventi = new Set<string>();
  loadingExpandTokens = new Set<string>();
  loadingExpandEventi = new Set<string>();

  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RicercaOperazioniService);
  private readonly spinner = inject(NgxSpinnerService);
}
```

### `ngOnInit()`

1. Leggere `positionId` da `this.route.snapshot.paramMap.get('positionId')`.
2. Se `positionId` è null, tornare alla pagina precedente.
3. Chiamare `service.getPosizioneDettaglio(positionId)` e al completamento:
   - Popolare `this.dettaglio`
   - Popolare `this.tokensData` e `this.eventiData`
   - Impostare `isLoading = false`

### Metodo `toggleTokenExpand(token: IToken)`

1. Se il token è già espanso (set `expandedTokens` contiene `token.token`), rimuoverlo (collassa).
2. Se non espanso:
   - Se `token.dettaglio` è già valorizzato (già caricato in precedenza), semplicemente aggiungere al set.
   - Altrimenti: aggiungere `token.token` a `loadingExpandTokens`, chiamare
     `service.getTokenDettaglio(token.token)`, al completamento popolare `token.dettaglio`,
     rimuovere da `loadingExpandTokens`, aggiungere a `expandedTokens`.

### Metodo `toggleEventoExpand(evento: IEvento)`

Stessa logica di `toggleTokenExpand` ma per gli eventi, usando `loadingExpandEventi` e `expandedEventi`.

### `previousState()`

`window.history.back()`

---

## HTML — `ricerca-operazioni-detail.component.html`

### Struttura

```
[Header con titolo + bottone Back]
[Card principale: dati posizione]
[Mat Tab Group: TAB "Tokens" | TAB "Eventi"]
  [TAB Tokens: tabella con expand]
  [TAB Eventi: tabella con expand]
```

### Sezione dati posizione (mat-card)

Griglia Bootstrap con i campi di `dettaglio.posizione`:

- `positionId`, `paEmittente`, `numeroAvviso`, `iuv`, `importo`, `descrizione`
- Usare le chiavi i18n `pagopaCruscottoApp.ricercaOperazioni.detail.*`
- Mostrare `<ngx-spinner>` mentre `isLoading` è true.

### TAB Tokens (`mat-tab label="..." dal i18n`)

Tabella `mat-table` con `[dataSource]="tokensData"`:

Colonne: `token`, `importo`, `stato`, `dataCreazione`, `expand`

**Colonna `expand`** (ultima colonna):

```html
<button
  mat-icon-button
  (click)="toggleTokenExpand(row)"
  [title]="expandedTokens.has(row.token)
                 ? ('pagopaCruscottoApp.ricercaOperazioni.detail.collapse' | translate)
                 : ('pagopaCruscottoApp.ricercaOperazioni.detail.expand' | translate)"
>
  <mat-icon fontSet="material-symbols-outlined"> {{ expandedTokens.has(row.token) ? 'expand_less' : 'expand_more' }} </mat-icon>
  <ngx-spinner ... *ngIf="loadingExpandTokens.has(row.token)"></ngx-spinner>
</button>
```

**Riga espansa** — Usando la feature `matDetailRow` di `mat-table` o una riga separata con `*ngIf`:

- Riga aggiuntiva `<tr mat-row *matRowDef="let row; columns: ['expandedDetail']; when: isTokenExpanded">` che occupa l'intera larghezza (`colspan`).
- Al suo interno mostrare `row.dettaglio` come JSON formattato (`<pre>`) o come lista chiave/valore.
- ⚠️ **INTEGRARE** con il template di dettaglio reale una volta definiti i campi di `ITokenDettaglio`.

### TAB Eventi (identica struttura)

Tabella `mat-table` con `[dataSource]="eventiData"`:

Colonne: `eventoId`, `tipo`, `dataEvento`, `stato`, `expand`

**Colonna `expand`** e **riga espansa** con la stessa struttura del TAB Tokens,
applicata a `IEventoDettaglio`.

- ⚠️ **INTEGRARE** il template di dettaglio espanso con i campi reali di `IEventoDettaglio`.

---

## SCSS

File vuoto o con override minimali. Aggiungere una classe `.expanded-row` per evidenziare
la riga espansa se necessario.

---

## ⚠️ Note

- Usare `mat-tab-group` (non `mat-tab-nav`) per mantenere la semplicità.
- L'espansione riga in `mat-table` si può realizzare tramite la direttiva
  `matDetailRow` oppure con `[@detailExpand]` animation — scegliere l'approccio
  già presente nel progetto se esiste, altrimenti usare la soluzione più semplice
  con una seconda riga condizionale tramite `when` predicate del `*matRowDef`.
- Consultare il file `src/main/webapp/app/entity/instance/detail/instance-detail.component.html`
  per pattern di layout già adottati nel progetto.
