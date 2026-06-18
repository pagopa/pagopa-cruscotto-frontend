import { inject, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { SertService } from '../../../../api-clients/pagopa-sert/api/sert.service';

import {
  IExtraInfo,
  IOperazioneRicercaResponse,
  IPosizione,
  ITokenInfo,
  ITransfers,
  IWorkflows,
  mapRawExtraInfo,
  mapRawPosizione,
  mapRawTokenInfo,
  mapRawTransfers,
  mapRawWorkflows,
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
  private readonly sertApi = inject(SertService);

  /** GET /api/search con combinazioni di campi supportate dal form. */
  search(p: {
    pa?: string;
    nav?: string;
    iuv?: string;
    token?: string;
    idCarrello?: string;
    info?: string;
    offset?: number;
  }): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.unifiedSearch(p);
  }
  /** GET /api/position/{nav}/{paEmittente} */
  getPosition(nav: string, paEmittente: string): Observable<IPosizione> {
    return this.sertApi.getPosition(nav, paEmittente).pipe(map(mapRawPosizione));
  }

  /** GET /api/token/{token} */
  getTokenInfo(token: string): Observable<ITokenInfo> {
    return this.sertApi.getTokenInfo(token).pipe(map(mapRawTokenInfo));
  }

  /** GET /api/extra/{token} */
  getExtraInfo(token: string): Observable<IExtraInfo> {
    return this.sertApi.getExtraInfo(token).pipe(map(mapRawExtraInfo));
  }

  /** GET /api/transfers/{nav}/{paEmittente}/{token} */
  getTransfers(nav: string, paEmittente: string, token: string): Observable<ITransfers> {
    return this.sertApi.getTransfers(nav, paEmittente, token).pipe(map(mapRawTransfers));
  }

  /** GET /api/workflows/{nav}/{paEmittente} */
  getWorkflows(nav: string, paEmittente: string): Observable<IWorkflows> {
    return this.sertApi.getWorkflows(nav, paEmittente).pipe(
      map(mapRawWorkflows),
      // In caso di errore restituiamo un workflow vuoto per non bloccare la vista
      catchError(() => of<IWorkflows>({ count: 0, eventsPosition: [], eventsToken: [] })),
    );
  }

  private unifiedSearch(p: {
    pa?: string;
    nav?: string;
    iuv?: string;
    token?: string;
    idCarrello?: string;
    info?: string;
    offset?: number;
  }): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.sertApi.search(p.pa, p.nav, p.iuv, p.token, p.idCarrello, p.info, p.offset, 'response').pipe(
      map(res => {
        const dto = res.body;
        const rows = (dto?.results ?? []).map(r => toOperazioneRicercaRow({ nav: r.nav, match: r.match, paEmittente: r['pa-emittente'] }));
        const body: IOperazioneRicercaResponse = {
          content: rows,
          totalElements: dto?.totalElements ?? dto?.count ?? rows.length,
          totalPages: dto?.totalPages ?? 1,
          size: dto?.size ?? rows.length,
          number: dto?.number ?? 0,
        };
        return new HttpResponse({ body, status: res.status, headers: res.headers });
      }),
    );
  }
}
