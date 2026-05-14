import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import SharedModule from '../../../../shared/shared.module';
import { IEvento, IEventoDettaglio, IPosizioneDettaglioFull, IToken, ITokenDettaglio } from '../models/ricerca-operazioni.model';
import { RicercaOperazioniService } from '../service/ricerca-operazioni.service';

@Component({
  selector: 'jhi-ricerca-operazioni-detail',
  templateUrl: './ricerca-operazioni-detail.component.html',
  styleUrls: ['./ricerca-operazioni-detail.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    NgxSpinnerModule,
  ],
})
export class RicercaOperazioniDetailComponent implements OnInit {
  positionId: string | null = null;
  dettaglio: IPosizioneDettaglioFull | null = null;
  isLoading = true;

  tokensData: IToken[] = [];
  eventiData: IEvento[] = [];

  tokensColumns: string[] = ['token', 'importo', 'stato', 'dataCreazione', 'expand'];
  eventiColumns: string[] = ['eventoId', 'tipo', 'dataEvento', 'stato', 'expand'];

  expandedTokens = new Set<string>();
  expandedEventi = new Set<string>();
  loadingExpandTokens = new Set<string>();
  loadingExpandEventi = new Set<string>();

  locale: string;

  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RicercaOperazioniService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.locale = this.translateService.currentLang;
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.locale = event.lang;
    });

    this.positionId = this.route.snapshot.paramMap.get('positionId');
    if (!this.positionId) {
      window.history.back();
      return;
    }

    this.spinner.show('detailSpinner');
    this.service.getPosizioneDettaglio(this.positionId).subscribe({
      next: res => {
        if (res.body) {
          this.dettaglio = res.body;
          this.tokensData = [...res.body.tokens];
          this.eventiData = [...res.body.eventi];
        }
        this.isLoading = false;
        this.spinner.hide('detailSpinner');
      },
      error: () => {
        this.isLoading = false;
        this.spinner.hide('detailSpinner');
      },
    });
  }

  toggleTokenExpand(token: IToken): void {
    const key = token.token;
    if (this.expandedTokens.has(key)) {
      this.expandedTokens.delete(key);
      return;
    }
    if (token.dettaglio != null) {
      this.expandedTokens.add(key);
      return;
    }
    this.loadingExpandTokens.add(key);
    this.service.getTokenDettaglio(key).subscribe({
      next: (det: ITokenDettaglio) => {
        token.dettaglio = det;
        this.loadingExpandTokens.delete(key);
        this.expandedTokens.add(key);
        this.tokensData = [...this.tokensData]; // trigger change detection
      },
      error: () => {
        this.loadingExpandTokens.delete(key);
      },
    });
  }

  toggleEventoExpand(evento: IEvento): void {
    const key = evento.eventoId;
    if (this.expandedEventi.has(key)) {
      this.expandedEventi.delete(key);
      return;
    }
    if (evento.dettaglio != null) {
      this.expandedEventi.add(key);
      return;
    }
    this.loadingExpandEventi.add(key);
    this.service.getEventoDettaglio(key).subscribe({
      next: (det: IEventoDettaglio) => {
        evento.dettaglio = det;
        this.loadingExpandEventi.delete(key);
        this.expandedEventi.add(key);
        this.eventiData = [...this.eventiData]; // trigger change detection
      },
      error: () => {
        this.loadingExpandEventi.delete(key);
      },
    });
  }

  isTokenExpanded = (index: number, row: IToken): boolean => this.expandedTokens.has(row.token);
  isEventoExpanded = (index: number, row: IEvento): boolean => this.expandedEventi.has(row.eventoId);

  previousState(): void {
    window.history.back();
  }
}
