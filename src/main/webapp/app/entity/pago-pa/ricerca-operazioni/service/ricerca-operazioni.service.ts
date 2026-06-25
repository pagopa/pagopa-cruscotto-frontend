import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { SertService } from '../../../../api-clients/pagopa-sert/api/sert.service';
import { CustomHttpUrlEncodingCodec } from '../../../../api-clients/pagopa-sert/encoder';

import {
  IExtraInfo,
  IRawUnifiedSearchPayload,
  IRawPositionPayment,
  IRawWorkflowResponse,
  IOperazioneRicercaResponse,
  IPosizione,
  ITokenInfo,
  ITransfers,
  IWorkflows,
  mapRawExtraInfo,
  mapRawPosizione,
  mapRawTokenInfo,
  mapRawTransfers,
  mapRawUnifiedSearchResponse,
  mapRawWorkflows,
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
  private readonly http = inject(HttpClient);

  /** GET /api/search con combinazioni di campi supportate dal form. */
  search(p: {
    pa?: string;
    nav?: string;
    iuv?: string;
    token?: string;
    idCarrello?: string;
    info?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.unifiedSearch(p);
  }
  /** GET /api/position/{nav}/{paEmittente} con paginazione/sort server-side per tokens. */
  getPosition(nav: string, paEmittente: string, page?: number, size?: number, sort?: string): Observable<IPosizione> {
    const params = this.toPageableParams(page, size, sort);
    const basePath = (this.sertApi as any).basePath as string;
    const url = `${basePath}/api/position/${encodeURIComponent(nav)}/${encodeURIComponent(paEmittente)}`;
    return this.http.get<IRawPositionPayment>(url, { params }).pipe(map(mapRawPosizione));
  }

  /** GET /api/token/{token} */
  getTokenInfo(token: string): Observable<ITokenInfo> {
    return this.sertApi.getTokenInfo(token).pipe(map(mapRawTokenInfo));
  }

  /** GET /api/extra/{token} con paginazione/sort server-side. */
  getExtraInfo(token: string, page?: number, size?: number, sort?: string): Observable<IExtraInfo> {
    return this.sertApi.getExtraInfo(token, page, size, sort).pipe(map(mapRawExtraInfo));
  }

  /** GET /api/transfers/{nav}/{paEmittente}/{token} con paginazione/sort server-side. */
  getTransfers(nav: string, paEmittente: string, token: string, page?: number, size?: number, sort?: string): Observable<ITransfers> {
    return this.sertApi.getTransfers(nav, paEmittente, token, page, size, sort).pipe(map(mapRawTransfers));
  }

  /** GET /api/workflows/{nav}/{paEmittente} con paginazione/sort server-side. */
  getWorkflows(nav: string, paEmittente: string, page?: number, size?: number, sort?: string): Observable<IWorkflows> {
    const params = this.toPageableParams(page, size, sort);
    const basePath = (this.sertApi as any).basePath as string;
    const url = `${basePath}/api/workflows/${encodeURIComponent(nav)}/${encodeURIComponent(paEmittente)}`;
    return this.http.get<IRawWorkflowResponse>(url, { params }).pipe(
      map(mapRawWorkflows),
      // In caso di errore restituiamo un workflow vuoto per non bloccare la vista
      catchError(() => of<IWorkflows>({ count: 0, eventsPosition: [], eventsToken: [] })),
    );
  }

  private toPageableParams(page?: number, size?: number, sort?: string): HttpParams {
    let params = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (page != null) params = params.set('page', page.toString());
    if (size != null) params = params.set('size', size.toString());
    if (sort != null) params = params.set('sort', sort);
    return params;
  }

  private unifiedSearch(p: {
    pa?: string;
    nav?: string;
    iuv?: string;
    token?: string;
    idCarrello?: string;
    info?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.sertApi.search(p.pa, p.nav, p.iuv, p.token, p.idCarrello, p.info, p.page, p.size, p.sort, 'response').pipe(
      map(res => {
        const body = mapRawUnifiedSearchResponse(res.body as IRawUnifiedSearchPayload);
        const totalFromHeader = Number(res.headers.get('x-total-count'));

        return new HttpResponse({
          body: {
            ...body,
            totalElements: Number.isFinite(totalFromHeader) ? totalFromHeader : body.totalElements,
          },
          status: res.status,
          headers: res.headers,
        });
      }),
    );
  }
}
