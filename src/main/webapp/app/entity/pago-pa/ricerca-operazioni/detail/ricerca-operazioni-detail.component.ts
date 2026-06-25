import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { catchError, forkJoin, map, of } from 'rxjs';

import SharedModule from '../../../../shared/shared.module';
import {
  IEventoRow,
  IExtraInfo,
  IExtraInfoObject,
  IPosizione,
  ITokenInfo,
  ITokenRow,
  ITransfers,
  IWorkflows,
} from '../models/ricerca-operazioni.model';
import { RicercaOperazioniService } from '../service/ricerca-operazioni.service';

/**
 * Sotto-sezione espandibile (Dettaglio Token, Transfers, Informazioni Aggiuntive)
 * mostrata nella riga espansa di un token.
 * L'ordine di esposizione è fissato dalla specifica: info → transfers → extra.
 */
type TokenSubSection = 'info' | 'transfers' | 'extra';

type ExtraInfoSortField = 'name' | 'value' | 'tipoevento' | '';
type TransfersSortField = 'idTransfer' | 'iban' | 'amount' | 'typeTransfer' | 'paFiscalCode' | '';
type EventiSortField = 'eventoId' | 'tipo' | 'sottotipo' | 'outcome' | 'token' | 'dataEvento' | '';
type TokensSortField = 'paymentBorn' | 'token' | 'pspName' | 'pspDescription' | 'amount' | 'paymentMethod' | 'touchpoint';

interface IExtraInfoTableState {
  pageIndex: number;
  pageSize: number;
  sortActive: ExtraInfoSortField;
  sortDirection: 'asc' | 'desc' | '';
}

interface ITransfersTableState {
  pageIndex: number;
  pageSize: number;
  sortActive: TransfersSortField;
  sortDirection: 'asc' | 'desc' | '';
}

interface ITokensTableState {
  pageIndex: number;
  pageSize: number;
  sortActive: TokensSortField | '';
  sortDirection: 'asc' | 'desc' | '';
}

interface IWorkflowsTableState {
  pageIndex: number;
  pageSize: number;
  sortActive: EventiSortField;
  sortDirection: 'asc' | 'desc' | '';
}

@Component({
  selector: 'jhi-ricerca-operazioni-detail',
  templateUrl: './ricerca-operazioni-detail.component.html',
  styleUrls: ['./ricerca-operazioni-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    NgxSpinnerModule,
  ],
})
export class RicercaOperazioniDetailComponent implements OnInit {
  paEmittente: string | null = null;
  nav: string | null = null;

  /** Posizione (vista centrale) — DTO restituito da GET /api/position/{nav}/{pa}. */
  posizione: IPosizione | null = null;

  /** Workflow (eventi posizione + eventi token). */
  workflows: IWorkflows | null = null;

  /** Righe della tabella Tokens (derivate da posizione.allTokens). */
  tokensData: ITokenRow[] = [];

  /** Righe della tabella Eventi (unione di eventsPosition + eventsToken). */
  eventiData: IEventoRow[] = [];

  // ---- Colonne ----
  tokensColumns: string[] = [
    'paymentBorn',
    'token',
    'pspName',
    'pspDescription',
    'amount',
    'paymentMethod',
    'touchpoint',
    'isPayed',
    'expand',
  ];
  eventiColumns: string[] = ['eventoId', 'tipo', 'sottotipo', 'outcome', 'token', 'dataEvento'];
  readonly eventiPageSize: number = 10;
  workflowsTableState: IWorkflowsTableState = {
    pageIndex: 0,
    pageSize: 10,
    sortActive: '',
    sortDirection: '',
  };
  private workflowsTotalCount: number = 0;

  // ---- Stato espansione ----
  expandedTokens = new Set<string>();
  expandedEventi = new Set<string>();
  /** Stato di caricamento delle sotto-sezioni di un token: key = `${token}:${section}`. */
  loadingSections = new Set<string>();

  readonly extraInfoColumns: string[] = ['name', 'value', 'tipoevento'];
  private readonly extraInfoTableStateByToken: Record<string, IExtraInfoTableState> = {};

  readonly transfersColumns: string[] = ['idTransfer', 'iban', 'amount', 'typeTransfer', 'paFiscalCode'];
  private readonly transfersTableStateByToken: Record<string, ITransfersTableState> = {};
  private readonly tokenInfoCacheByToken: Record<string, ITokenInfo> = {};

  // ---- Stato paginazione Tokens ----
  tokensTableState: ITokensTableState = {
    pageIndex: 0,
    pageSize: 10,
    sortActive: '',
    sortDirection: '',
  };
  private tokensTokenTotalCount: number = 0;

  isLoading = true;
  isEventiLoading = false;

  @ViewChild(MatTabGroup) tabGroup?: MatTabGroup;

  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RicercaOperazioniService);
  private readonly spinner = inject(NgxSpinnerService);

  private buildTokenRows(tokens: string[]): ITokenRow[] {
    return tokens.map(token => ({
      token,
      info: this.tokenInfoCacheByToken[token] ?? null,
      transfers: null,
      extra: null,
    }));
  }

  // ============================================================
  // Lifecycle
  // ============================================================

  ngOnInit(): void {
    this.paEmittente = this.route.snapshot.paramMap.get('paEmittente');
    this.nav = this.route.snapshot.paramMap.get('nav');

    if (!this.paEmittente || !this.nav) {
      window.history.back();
      return;
    }

    this.loadPosizione();
  }

  /** Carica la posizione (vista centrale) + workflow in parallelo. */
  private loadPosizione(): void {
    if (!this.paEmittente || !this.nav) return;

    this.isLoading = true;
    this.spinner.show('detailSpinner');

    forkJoin({
      posizione: this.service.getPosition(this.nav, this.paEmittente),
      workflows: this.service.getWorkflows(this.nav, this.paEmittente),
    }).subscribe({
      next: ({ posizione, workflows }) => {
        this.posizione = posizione;
        this.workflows = workflows;

        // Tabella Tokens: una riga per ogni token in allTokens.
        this.tokensData = this.buildTokenRows(posizione.allTokens ?? []);
        this.tokensTokenTotalCount = posizione.totalTokens ?? posizione.tokens ?? posizione.allTokens?.length ?? 0;

        // Preload sezione "info": dopo /api/position, chiama /api/token per ogni token.
        this.preloadTokenInfo();

        // Tabella Eventi: estrai e valorizza i dati dal workflow con il conteggio totale
        this.buildEventiRows(workflows);
        this.workflowsTableState.pageIndex = 0;
        this.workflowsTableState.sortActive = '';
        this.workflowsTableState.sortDirection = '';

        this.isLoading = false;
        this.spinner.hide('detailSpinner');
      },
      error: () => {
        this.isLoading = false;
        this.spinner.hide('detailSpinner');
      },
    });
  }

  /** Costruisce la tabella eventi dal workflow e aggiorna il conteggio totale. */
  private buildEventiRows(workflows: IWorkflows): void {
    const positionEvents: IEventoRow[] = (workflows.eventsPosition ?? []).map((e, idx) => ({
      ...e,
      rowId: e.eventId ?? `pos-${idx}`,
    }));
    const tokenEvents: IEventoRow[] = (workflows.eventsToken ?? []).map((e, idx) => ({
      ...e,
      rowId: e.eventId ?? `tok-${idx}`,
      token: e.token,
    }));
    this.eventiData = [...tokenEvents];
    this.workflowsTotalCount = workflows.count ?? this.eventiData.length;
  }

  // ============================================================
  // Navigazione
  // ============================================================

  previousState(): void {
    window.history.back();
  }

  /** Apre la TAB Tokens e espande la riga del token richiesto. */
  goToTokenDetail(token: string | undefined): void {
    if (!token) return;
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 0;
    }
    const row = this.tokensData.find(r => r.token === token);
    if (row && !this.expandedTokens.has(token)) {
      this.toggleTokenExpand(row);
    }
  }

  // ============================================================
  // Espansione Tokens
  // ============================================================

  /** Carica in background le info token per tutte le righe disponibili. */
  private preloadTokenInfo(): void {
    if (!this.tokensData.length) return;

    const rowsToLoad = this.tokensData.filter(row => row.info == null && !this.tokenInfoCacheByToken[row.token]);
    if (!rowsToLoad.length) {
      this.tokensData = [...this.tokensData];
      return;
    }

    const requests = rowsToLoad.map(row => {
      const key = `${row.token}:info`;
      this.loadingSections.add(key);

      return this.service.getTokenInfo(row.token).pipe(
        map((info: ITokenInfo) => ({ row, info, key })),
        catchError(() => of({ row, info: null as ITokenInfo | null, key })),
      );
    });

    forkJoin(requests).subscribe(results => {
      results.forEach(({ row, info, key }) => {
        if (info) {
          this.tokenInfoCacheByToken[row.token] = info;
          row.info = info;
        }
        this.loadingSections.delete(key);
      });

      this.tokensData = [...this.tokensData];
    });
  }

  /**
   * Espande/collassa la riga di un token. Le sotto-sezioni (transfers/extra) si caricano
   * lazy quando il relativo accordion panel viene aperto; la sezione info viene pre-caricata.
   */
  toggleTokenExpand(row: ITokenRow): void {
    if (this.expandedTokens.has(row.token)) {
      this.expandedTokens.delete(row.token);
    } else {
      this.expandedTokens.add(row.token);
    }
    this.tokensData = [...this.tokensData];
  }

  /**
   * Carica on-demand una singola sotto-sezione di un token. Invocato da `(opened)` su
   * ciascun `mat-expansion-panel`. Il risultato è cachato sulla `row`: chiamate successive
   * (riapertura del panel, del token o cambio tab) non rigenerano la richiesta.
   * Eccezione: extra e transfers supportano paginazione/sort server-side e non sono cachati.
   */
  loadTokenSection(row: ITokenRow, section: TokenSubSection): void {
    if (section === 'info' && row.info == null && this.tokenInfoCacheByToken[row.token]) {
      row.info = this.tokenInfoCacheByToken[row.token];
      this.tokensData = [...this.tokensData];
      return;
    }

    // Cache hit: solo per info; extra e transfers supportano paginazione/sort server-side.
    if (section === 'info' && row[section] != null) return;
    const key = `${row.token}:${section}`;
    if (this.loadingSections.has(key)) return;
    this.loadingSections.add(key);

    const onDone = (): void => {
      this.loadingSections.delete(key);
      this.tokensData = [...this.tokensData];
    };

    switch (section) {
      case 'info':
        this.service.getTokenInfo(row.token).subscribe({
          next: (info: ITokenInfo) => {
            this.tokenInfoCacheByToken[row.token] = info;
            row.info = info;
            onDone();
          },
          error: onDone,
        });
        break;
      case 'transfers':
        this.fetchTransfers(row, onDone);
        break;
      case 'extra':
        this.fetchExtraInfo(row, onDone);
        break;
    }
  }

  isTokenSectionLoading(token: string, section: TokenSubSection): boolean {
    return this.loadingSections.has(`${token}:${section}`);
  }

  getExtraInfoTableState(token: string): IExtraInfoTableState {
    const existingState = this.extraInfoTableStateByToken[token];
    if (existingState) {
      return existingState;
    }

    const initialState: IExtraInfoTableState = {
      pageIndex: 0,
      pageSize: 5,
      sortActive: '',
      sortDirection: '',
    };
    this.extraInfoTableStateByToken[token] = initialState;
    return initialState;
  }

  onExtraInfoSortChange(row: ITokenRow, sort: Sort): void {
    const state = this.getExtraInfoTableState(row.token);

    if (!sort.active || (sort.active !== 'name' && sort.active !== 'value' && sort.active !== 'tipoevento')) {
      state.sortActive = '';
      state.sortDirection = '';
      state.pageIndex = 0;
      this.loadTokenSection(row, 'extra');
      return;
    }

    state.sortActive = sort.active;
    state.sortDirection = sort.direction;
    state.pageIndex = 0;
    this.loadTokenSection(row, 'extra');
  }

  onExtraInfoPageChange(row: ITokenRow, event: PageEvent): void {
    const state = this.getExtraInfoTableState(row.token);
    state.pageIndex = event.pageIndex;
    this.loadTokenSection(row, 'extra');
  }

  getExtraInfoResults(row: ITokenRow): IExtraInfoObject[] {
    return row.extra?.results ?? [];
  }

  getExtraInfoTotalCount(row: ITokenRow): number {
    return row.extra?.count ?? row.extra?.results?.length ?? 0;
  }

  private fetchExtraInfo(row: ITokenRow, onDone?: () => void): void {
    const state = this.getExtraInfoTableState(row.token);
    const sortParam = this.buildExtraInfoSortParam(state);

    this.service.getExtraInfo(row.token, state.pageIndex, state.pageSize, sortParam).subscribe({
      next: (extra: IExtraInfo) => {
        row.extra = extra;
        onDone?.();
      },
      error: () => onDone?.(),
    });
  }

  private buildExtraInfoSortParam(state: IExtraInfoTableState): string | undefined {
    if (!state.sortActive || !state.sortDirection) {
      return undefined;
    }

    return `${state.sortActive},${state.sortDirection}`;
  }

  // ============================================================
  // Transfers: Pagination & Sort (Server-side)
  // ============================================================

  getTransfersTableState(token: string): ITransfersTableState {
    if (!this.transfersTableStateByToken[token]) {
      const initialState: ITransfersTableState = {
        pageIndex: 0,
        pageSize: 3,
        sortActive: '',
        sortDirection: '',
      };
      this.transfersTableStateByToken[token] = initialState;
      return initialState;
    }
    return this.transfersTableStateByToken[token];
  }

  onTransfersSortChange(row: ITokenRow, sort: Sort): void {
    const state = this.getTransfersTableState(row.token);

    if (
      !sort.active ||
      (sort.active !== 'idTransfer' &&
        sort.active !== 'iban' &&
        sort.active !== 'amount' &&
        sort.active !== 'typeTransfer' &&
        sort.active !== 'paFiscalCode')
    ) {
      state.sortActive = '';
      state.sortDirection = '';
      state.pageIndex = 0;
      this.loadTokenSection(row, 'transfers');
      return;
    }

    state.sortActive = sort.active as TransfersSortField;
    state.sortDirection = sort.direction;
    state.pageIndex = 0;
    this.loadTokenSection(row, 'transfers');
  }

  onTransfersPageChange(row: ITokenRow, event: PageEvent): void {
    const state = this.getTransfersTableState(row.token);
    state.pageIndex = event.pageIndex;
    this.loadTokenSection(row, 'transfers');
  }

  onEventiSortChange(sort: Sort): void {
    if (
      !sort.active ||
      (sort.active !== 'eventoId' &&
        sort.active !== 'tipo' &&
        sort.active !== 'sottotipo' &&
        sort.active !== 'outcome' &&
        sort.active !== 'token' &&
        sort.active !== 'dataEvento')
    ) {
      this.workflowsTableState.sortActive = '';
      this.workflowsTableState.sortDirection = '';
      this.workflowsTableState.pageIndex = 0;
      this.reloadWorkflows();
      return;
    }

    this.workflowsTableState.sortActive = sort.active as EventiSortField;
    this.workflowsTableState.sortDirection = sort.direction;
    this.workflowsTableState.pageIndex = 0;
    this.reloadWorkflows();
  }

  onEventiPageChange(event: PageEvent): void {
    this.workflowsTableState.pageIndex = event.pageIndex;
    this.reloadWorkflows();
  }

  getEventiResults(): IEventoRow[] {
    return this.eventiData;
  }

  getEventiTotalCount(): number {
    return this.workflowsTotalCount;
  }

  /** Ricarica i workflow dal server con i parametri attuali di paginazione/sort. */
  private reloadWorkflows(): void {
    if (!this.paEmittente || !this.nav) return;

    this.isEventiLoading = true;

    const sortParam = this.buildWorkflowsSortParam(this.workflowsTableState);

    this.service
      .getWorkflows(this.nav, this.paEmittente, this.workflowsTableState.pageIndex, this.workflowsTableState.pageSize, sortParam)
      .subscribe({
        next: workflows => {
          this.workflows = workflows;
          this.buildEventiRows(workflows);
          this.isEventiLoading = false;
        },
        error: () => {
          this.isEventiLoading = false;
        },
      });
  }

  private buildWorkflowsSortParam(state: IWorkflowsTableState): string | undefined {
    if (!state.sortActive || !state.sortDirection) {
      return undefined;
    }

    // Mappare i nomi dei campi frontend ai nomi backend
    const fieldMap: Record<EventiSortField, string> = {
      eventoId: 'eventId',
      tipo: 'tipoevento',
      sottotipo: 'sottotipoevento',
      outcome: 'outcome',
      token: 'token',
      dataEvento: 'insertedtimestamp',
      '': '',
    };

    const backendField = fieldMap[state.sortActive];
    if (!backendField) {
      return undefined;
    }

    return `${backendField},${state.sortDirection}`;
  }

  getTransfersResults(row: ITokenRow): any[] {
    return row.transfers?.transfers ?? [];
  }

  getTransfersTotalCount(row: ITokenRow): number {
    return row.transfers?.count ?? row.transfers?.transfers?.length ?? 0;
  }

  private fetchTransfers(row: ITokenRow, onDone?: () => void): void {
    if (!this.paEmittente || !this.nav) {
      onDone?.();
      return;
    }

    const state = this.getTransfersTableState(row.token);
    const sortParam = this.buildTransfersSortParam(state);

    this.service.getTransfers(this.nav, this.paEmittente, row.token, state.pageIndex, state.pageSize, sortParam).subscribe({
      next: (transfers: ITransfers) => {
        row.transfers = transfers;
        onDone?.();
      },
      error: () => {
        // On error (e.g. 404), set empty result so the template shows the noTransfers message
        row.transfers = { transfers: [], count: 0, transfersCount: 0 };
        onDone?.();
      },
    });
  }

  private buildTransfersSortParam(state: ITransfersTableState): string | undefined {
    if (!state.sortActive || !state.sortDirection) {
      return undefined;
    }

    return `${state.sortActive},${state.sortDirection}`;
  }

  /** Chiude tutti i dettagli token aperti contemporaneamente. */
  collapseAllTokens(): void {
    this.expandedTokens.clear();
  }

  // ============================================================
  // Espansione Eventi
  // ============================================================

  toggleEventoExpand(row: IEventoRow): void {
    if (this.expandedEventi.has(row.rowId)) {
      this.expandedEventi.delete(row.rowId);
    } else {
      this.expandedEventi.add(row.rowId);
    }
  }

  get tokensTableStatePageIndex(): number {
    return this.tokensTableState.pageIndex;
  }

  get tokensTableStatePageSize(): number {
    return this.tokensTableState.pageSize;
  }

  isTokenExpanded = (_index: number, row: ITokenRow): boolean => this.expandedTokens.has(row.token);
  isEventoExpanded = (_index: number, row: IEventoRow): boolean => this.expandedEventi.has(row.rowId);

  transfersCount(row: ITokenRow): number {
    return row.transfers?.transfersCount ?? row.transfers?.transfers?.length ?? 0;
  }

  extraInfoCount(row: ITokenRow): number {
    return row.extra?.count ?? row.extra?.results?.length ?? 0;
  }

  getRowPaymentBorn(row: ITokenRow): Date | undefined {
    return row.info?.payed?.paymentBorn ?? this.posizione?.payed?.paymentBorn;
  }

  getRowPspName(row: ITokenRow): string | undefined {
    return row.info?.actors?.psp ?? this.posizione?.actors?.psp;
  }

  getRowAmount(row: ITokenRow): number | undefined {
    return row.info?.amount?.amount ?? this.posizione?.amount?.amount;
  }

  getRowPaymentMethod(row: ITokenRow): string | undefined {
    return row.info?.paymentInfo?.paymentMethod ?? this.posizione?.paymentInfo?.paymentMethod;
  }

  getRowTouchpoint(row: ITokenRow): string | undefined {
    return row.info?.paymentInfo?.touchpoint ?? this.posizione?.paymentInfo?.touchpoint;
  }

  isRowPayed(row: ITokenRow): boolean {
    if (row.info?.isPayedToken != null) {
      return row.info.isPayedToken;
    }
    if (row.info?.payed?.payedDate || row.info?.payed?.token) {
      return true;
    }
    return this.isPagata;
  }

  /** True se la posizione risulta pagata (presenza di payed con token o data pagamento). */
  get isPagata(): boolean {
    const p = this.posizione?.payed;
    return !!(p && (p.token || p.payedDate));
  }

  // evento Sort dalla tabella Tokens.
  onTokensSortChange(sort: Sort): void {
    const validFields: TokensSortField[] = ['paymentBorn', 'token', 'pspName', 'pspDescription', 'amount', 'paymentMethod', 'touchpoint'];

    if (!sort.active || !validFields.includes(sort.active as TokensSortField)) {
      return;
    }

    const nextDirection: 'asc' | 'desc' = sort.direction === 'desc' ? 'desc' : 'asc';
    this.tokensTableState.sortActive = sort.active as TokensSortField;
    this.tokensTableState.sortDirection = nextDirection;
    this.tokensTableState.pageIndex = 0;
    this.reloadTokens();
  }

  /** Gestisci evento PageChange dalla tabella Tokens. */
  onTokensPageChange(event: PageEvent): void {
    this.tokensTableState.pageIndex = event.pageIndex;
    this.reloadTokens();
  }

  /** Ricarica i token dal server con i parametri di paginazione e ordinamento correnti. */
  private reloadTokens(): void {
    if (!this.paEmittente || !this.nav) return;

    // Costruisci il parametro sort nel formato "fieldName,direction"
    let sortParam = '';
    if (this.tokensTableState.sortActive && this.tokensTableState.sortDirection) {
      const fieldMapping: Record<string, string> = {
        paymentBorn: 'tokenDateEvent',
        token: 'token',
        pspName: 'psp',
        pspDescription: 'ptPsp',
        amount: 'amount',
        paymentMethod: 'paymentMethod',
        touchpoint: 'touchpoint',
      };
      const backendFieldName = fieldMapping[this.tokensTableState.sortActive] || this.tokensTableState.sortActive;
      sortParam = `${backendFieldName},${this.tokensTableState.sortDirection}`;
    }

    this.service
      .getPosition(this.nav, this.paEmittente, this.tokensTableState.pageIndex, this.tokensTableState.pageSize, sortParam || undefined)
      .subscribe({
        next: posizione => {
          this.posizione = posizione;
          // Aggiorna tokensData con i token della pagina corrente
          this.tokensData = this.buildTokenRows(posizione.allTokens ?? []);
          // Salva il total count
          this.tokensTokenTotalCount = posizione.totalTokens ?? posizione.tokens ?? posizione.allTokens?.length ?? 0;
          // Precarica i dettagli dei token nella pagina
          this.preloadTokenInfo();
        },
        error: () => {
          // In caso di errore mantieni i dati precedenti
        },
      });
  }

  /** Ritorna i token da visualizzare nella tabella (già paginati dal server). */
  getTokensResults(): ITokenRow[] {
    return this.tokensData;
  }

  /** Ritorna il numero totale di token (per il paginator). */
  getTokensTotalCount(): number {
    return this.tokensTokenTotalCount;
  }
}
