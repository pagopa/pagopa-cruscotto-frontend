import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';

import SharedModule from '../../../../shared/shared.module';
import { IEventoRow, IExtraInfo, IPosizione, ITokenInfo, ITokenRow, ITransfers, IWorkflows } from '../models/ricerca-operazioni.model';
import { RicercaOperazioniService } from '../service/ricerca-operazioni.service';

/**
 * Sotto-sezione espandibile (Dettaglio Token, Transfers, Informazioni Aggiuntive)
 * mostrata nella riga espansa di un token.
 * L'ordine di esposizione è fissato dalla specifica: info → transfers → extra.
 */
type TokenSubSection = 'info' | 'transfers' | 'extra';

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
    MatProgressSpinnerModule,
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
  tokensColumns: string[] = ['token', 'expand'];
  eventiColumns: string[] = ['eventoId', 'tipo', 'sottotipo', 'outcome', 'token', 'dataEvento', 'expand'];

  // ---- Stato espansione ----
  expandedTokens = new Set<string>();
  expandedEventi = new Set<string>();
  /** Stato di caricamento delle sotto-sezioni di un token: key = `${token}:${section}`. */
  loadingSections = new Set<string>();

  isLoading = true;

  @ViewChild(MatTabGroup) tabGroup?: MatTabGroup;

  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RicercaOperazioniService);
  private readonly spinner = inject(NgxSpinnerService);

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
        this.tokensData = (posizione.allTokens ?? []).map(t => ({
          token: t,
          info: null,
          transfers: null,
          extra: null,
        }));

        // Tabella Eventi: unione di eventsPosition + eventsToken (i secondi hanno il campo `token`).
        const positionEvents: IEventoRow[] = (workflows.eventsPosition ?? []).map((e, idx) => ({
          ...e,
          rowId: e.eventId ?? `pos-${idx}`,
        }));
        const tokenEvents: IEventoRow[] = (workflows.eventsToken ?? []).map((e, idx) => ({
          ...e,
          rowId: e.eventId ?? `tok-${idx}`,
          token: e.token,
        }));
        // Ordino per timestamp decrescente (più recenti per primi); gli undefined vanno in coda.
        this.eventiData = [...positionEvents, ...tokenEvents].sort((a, b) => {
          const ta = a.insertedtimestamp ? new Date(a.insertedtimestamp).getTime() : 0;
          const tb = b.insertedtimestamp ? new Date(b.insertedtimestamp).getTime() : 0;
          return tb - ta;
        });

        this.isLoading = false;
        this.spinner.hide('detailSpinner');
      },
      error: () => {
        this.isLoading = false;
        this.spinner.hide('detailSpinner');
      },
    });
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

  /**
   * Espande/collassa la riga di un token. Le sotto-sezioni (info/transfers/extra) si caricano
   * lazy quando il relativo accordion panel viene aperto — vedi `loadTokenSection`.
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
   */
  loadTokenSection(row: ITokenRow, section: TokenSubSection): void {
    // Cache hit: dati già presenti sulla riga.
    if (row[section] != null) return;
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
            row.info = info;
            onDone();
          },
          error: onDone,
        });
        break;
      case 'transfers':
        if (!this.paEmittente || !this.nav) {
          onDone();
          return;
        }
        this.service.getTransfers(this.nav, this.paEmittente, row.token).subscribe({
          next: (t: ITransfers) => {
            row.transfers = t;
            onDone();
          },
          error: onDone,
        });
        break;
      case 'extra':
        this.service.getExtraInfo(row.token).subscribe({
          next: (extra: IExtraInfo) => {
            row.extra = extra;
            onDone();
          },
          error: onDone,
        });
        break;
    }
  }

  isTokenSectionLoading(token: string, section: TokenSubSection): boolean {
    return this.loadingSections.has(`${token}:${section}`);
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

  // ============================================================
  // Predicati per mat-table multiTemplateDataRows
  // ============================================================

  isTokenExpanded = (_index: number, row: ITokenRow): boolean => this.expandedTokens.has(row.token);
  isEventoExpanded = (_index: number, row: IEventoRow): boolean => this.expandedEventi.has(row.rowId);

  // ============================================================
  // Helpers per il template
  // ============================================================

  transfersCount(row: ITokenRow): number {
    return row.transfers?.transfersCount ?? 0;
  }

  extraInfoCount(row: ITokenRow): number {
    return row.extra?.count ?? row.extra?.results?.length ?? 0;
  }

  /** True se la posizione risulta pagata (presenza di payed con token o data pagamento). */
  get isPagata(): boolean {
    const p = this.posizione?.payed;
    return !!(p && (p.token || p.payedDate));
  }
}
