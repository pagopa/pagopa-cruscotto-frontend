import { inject, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { RicercaDellePosizioniDebitorieService } from '../../../../api-clients/pagopa-sert/api/ricercaDellePosizioniDebitorie.service';
import { VisualizzazionePosizioneDebitoriaService } from '../../../../api-clients/pagopa-sert/api/visualizzazionePosizioneDebitoria.service';
import { VisualizzazioneDettagliService } from '../../../../api-clients/pagopa-sert/api/visualizzazioneDettagli.service';

import {
  IExtraInfo,
  IOperazioneRicercaResponse,
  IPosizione,
  ITokenInfo,
  ITransfers,
  IWorkflows,
  toOperazioneRicercaRow,
} from '../models/ricerca-operazioni.model';

/**
 * Service applicativo della feature "Ricerca Operazioni".
 *
 * Espone una API a misura di view-model — internamente delega ai service generati
 * dal client OpenAPI (`api-clients/pagopa-sert`).
 */
@Injectable({ providedIn: 'root' })
export class RicercaOperazioniService {
  private readonly searchApi = inject(RicercaDellePosizioniDebitorieService);
  private readonly positionApi = inject(VisualizzazionePosizioneDebitoriaService);
  private readonly detailApi = inject(VisualizzazioneDettagliService);

  // ============================================================
  // Ricerca unificata
  // ============================================================

  /** GET /api/search?nav=...&pa=... */
  searchByNav(nav: string, paEmittente?: string): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.unifiedSearch({ nav, pa: paEmittente });
  }

  /** GET /api/search?iuv=...&pa=... */
  searchByIuv(iuv: string, paEmittente?: string): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.unifiedSearch({ iuv, pa: paEmittente });
  }

  /** GET /api/search?token=...&pa=... */
  searchByToken(token: string, paEmittente?: string): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.unifiedSearch({ token, pa: paEmittente });
  }

  /** GET /api/search?idCarrello=...&pa=... */
  searchByCart(idCart: string, paEmittente?: string): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.unifiedSearch({ idCarrello: idCart, pa: paEmittente });
  }

  /** GET /api/search?info=...&pa=... */
  searchByExtra(searchValue: string, paEmittente?: string): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.unifiedSearch({ info: searchValue, pa: paEmittente });
  }

  private unifiedSearch(p: {
    pa?: string;
    nav?: string;
    iuv?: string;
    token?: string;
    idCarrello?: string;
    info?: string;
  }): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.searchApi.search(p.pa, p.nav, p.iuv, p.token, p.idCarrello, p.info, 'response').pipe(
      map(res => {
        const dto = res.body;
        const rows = (dto?.results ?? []).map(toOperazioneRicercaRow);
        const body: IOperazioneRicercaResponse = {
          content: rows,
          totalElements: dto?.count ?? rows.length,
          totalPages: 1,
          size: rows.length,
          number: 0,
        };
        return new HttpResponse({ body, status: res.status, headers: res.headers });
      }),
    );
  }

  // ============================================================
  // Vista centrale del dettaglio posizione
  // ============================================================

  /** GET /api/position/{nav}/{paEmittente} */
  getPosition(nav: string, paEmittente: string): Observable<IPosizione> {
    return this.positionApi.getPosition(nav, paEmittente);
  }

  // ============================================================
  // Sezioni espandibili dei Token
  // ============================================================

  /** GET /api/token/{token} */
  getTokenInfo(token: string): Observable<ITokenInfo> {
    return this.detailApi.getTokenInfo(token);
  }

  /** GET /api/extra/{token} */
  getExtraInfo(token: string): Observable<IExtraInfo> {
    return this.detailApi.getExtraInfo(token);
  }

  /** GET /api/transfers/{nav}/{paEmittente}/{token} */
  getTransfers(nav: string, paEmittente: string, token: string): Observable<ITransfers> {
    return this.detailApi.getTransfers(nav, paEmittente, token);
  }

  // ============================================================
  // Workflow / Eventi
  // ============================================================

  /** GET /api/workflows/{nav}/{paEmittente} */
  getWorkflows(nav: string, paEmittente: string): Observable<IWorkflows> {
    return this.detailApi.getWorkflows(nav, paEmittente).pipe(
      // In caso di errore restituiamo un workflow vuoto per non bloccare la vista
      catchError(() => of<IWorkflows>({ count: 0, eventsPosition: [], eventsToken: [] })),
    );
  }
}
