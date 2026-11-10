import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { SertService } from '../../../../api-clients/pagopa-sert/api/sert.service';
import { CustomHttpUrlEncodingCodec } from '../../../../api-clients/pagopa-sert/encoder';

import {
  IExtraInfo,
  IRawExtraInfoResponse,
  IRawUnifiedSearchPayload,
  IRawPositionPayment,
  IRawWorkflowResponse,
  IRawTransfersResponse,
  IOperazioneRicercaResponse,
  IPosizione,
  IRawTokenInfo,
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

export interface HistorySearchParams {
  dateFrom?: string;
  dateTo?: string;
  fromHistory?: boolean;
  fromOnline?: boolean;
}

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
    dateFrom?: string;
    dateTo?: string;
    fromHistory?: boolean;
    info?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    return this.unifiedSearch(p);
  }
  /** GET /api/position/{nav}/{paEmittente} con paginazione/sort server-side per tokens. */
  getPosition(
    nav: string,
    paEmittente: string,
    page?: number,
    size?: number,
    sort?: string,
    history?: HistorySearchParams,
  ): Observable<IPosizione> {
    const params = this.toHistoryParams(history, this.toPageableParams(page, size, sort));
    const basePath = (this.sertApi as any).basePath as string;
    const url = `${basePath}/api/position/${encodeURIComponent(nav)}/${encodeURIComponent(paEmittente)}`;
    return this.http.get<IRawPositionPayment>(url, { params }).pipe(map(mapRawPosizione));
  }

  /** GET /api/token/{token} */
  getTokenInfo(token: string, history?: HistorySearchParams): Observable<ITokenInfo> {
    if (!history?.fromHistory) {
      return this.sertApi.getTokenInfo(token).pipe(map(mapRawTokenInfo));
    }

    const basePath = (this.sertApi as any).basePath as string;
    return this.http
      .get<IRawTokenInfo>(`${basePath}/api/token/${encodeURIComponent(token)}`, { params: this.toHistoryParams(history) })
      .pipe(map(mapRawTokenInfo));
  }

  /** GET /api/extra/{token} con paginazione/sort server-side. */
  getExtraInfo(token: string, page?: number, size?: number, sort?: string, history?: HistorySearchParams): Observable<IExtraInfo> {
    const params = this.toHistoryParams(history, this.toPageableParams(page, size, sort));
    const basePath = (this.sertApi as any).basePath as string;
    return this.http.get<IRawExtraInfoResponse>(`${basePath}/api/extra/${encodeURIComponent(token)}`, { params }).pipe(
      map(mapRawExtraInfo),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of<IExtraInfo>({ count: 0, results: [] });
        }

        throw error;
      }),
    );
  }

  /** GET /api/transfers/{nav}/{paEmittente}/{token} con paginazione/sort server-side. */
  getTransfers(
    nav: string,
    paEmittente: string,
    token: string,
    page?: number,
    size?: number,
    sort?: string,
    history?: HistorySearchParams,
  ): Observable<ITransfers> {
    const params = this.toHistoryParams(history, this.toPageableParams(page, size, sort));
    const basePath = (this.sertApi as any).basePath as string;
    const url = `${basePath}/api/transfers/${encodeURIComponent(nav)}/${encodeURIComponent(paEmittente)}/${encodeURIComponent(token)}`;
    return this.http.get<IRawTransfersResponse>(url, { params }).pipe(
      map(mapRawTransfers),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of<ITransfers>({ token, transfers: [], count: 0, transfersCount: 0 });
        }

        throw error;
      }),
    );
  }

  /** GET /api/workflows/{nav}/{paEmittente} con paginazione/sort server-side. */
  getWorkflows(
    nav: string,
    paEmittente: string,
    page?: number,
    size?: number,
    sort?: string,
    history?: HistorySearchParams,
  ): Observable<IWorkflows> {
    const params = this.toHistoryParams(history, this.toPageableParams(page, size, sort));
    const basePath = (this.sertApi as any).basePath as string;
    const url = `${basePath}/api/workflows/${encodeURIComponent(nav)}/${encodeURIComponent(paEmittente)}`;
    return this.http.get<IRawWorkflowResponse>(url, { params, observe: 'response' }).pipe(
      map(response => {
        const workflows = mapRawWorkflows(response.body ?? []);
        const totalCount = Number(response.headers.get('x-total-count'));

        return {
          ...workflows,
          count: totalCount,
        };
      }),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of<IWorkflows>({ count: 0, events: [] });
        }

        throw error;
      }),
    );
  }

  private toPageableParams(page?: number, size?: number, sort?: string): HttpParams {
    let params = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (page != null) params = params.set('page', page.toString());
    if (size != null) params = params.set('size', size.toString());
    if (sort != null) params = params.set('sort', sort);
    return params;
  }

  private toHistoryParams(
    history?: HistorySearchParams,
    params = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() }),
  ): HttpParams {
    if (!history?.fromHistory) {
      return params;
    }

    params = params.set('fromHistory', 'true');
    if (history.dateFrom) params = params.set('dateFrom', history.dateFrom);
    if (history.dateTo) params = params.set('dateTo', history.dateTo);
    if (history.fromOnline === false) params = params.set('fromOnline', 'false');
    return params;
  }

  private unifiedSearch(p: {
    pa?: string;
    nav?: string;
    iuv?: string;
    token?: string;
    idCarrello?: string;
    dateFrom?: string;
    dateTo?: string;
    fromHistory?: boolean;
    info?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    let params = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    Object.entries(p).forEach(([key, value]) => {
      if (value != null) {
        params = params.set(key, String(value));
      }
    });

    const basePath = (this.sertApi as any).basePath as string;
    return this.http.get<IRawUnifiedSearchPayload>(`${basePath}/api/search`, { params, observe: 'response' }).pipe(
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
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          const pageSize = p.size ?? 10;
          const pageNumber = p.page ?? 0;

          return of(
            new HttpResponse<IOperazioneRicercaResponse>({
              body: {
                content: [],
                totalElements: 0,
                totalPages: 0,
                size: pageSize,
                number: pageNumber,
              },
              status: 200,
              headers: new HttpHeaders({ 'x-total-count': '0' }),
            }),
          );
        }

        throw error;
      }),
    );
  }
}
