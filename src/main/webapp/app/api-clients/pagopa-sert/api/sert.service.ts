/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { Observable } from 'rxjs';

import {
  IRawUnifiedSearchResponse,
  IRawPositionPayment,
  IRawTokenInfo,
  IRawTransferPayment,
  IRawWorkflowResponse,
  IRawExtraInfoResponse,
} from '../../../entity/pago-pa/ricerca-operazioni/models/ricerca-operazioni.model';

import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';

/**
 * Client HTTP generato per SertResource (cruscotto-sert-backend).
 * Espone tutti e 6 gli endpoint del controller /api con i tipi raw che rispecchiano
 * fedelmente la forma JSON restituita dal backend (chiavi kebab-case).
 */
@Injectable()
export class SertService {
  protected basePath = 'http://localhost:8081';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration,
  ) {
    if (basePath != null) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath != null ? basePath : (configuration.basePath ?? this.basePath);
    }
  }

  // ─── GET /api/search ──────────────────────────────────────────────────────

  public search(
    pa?: string,
    nav?: string,
    iuv?: string,
    token?: string,
    idCarrello?: string,
    info?: string,
    offset?: number,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<IRawUnifiedSearchResponse>;
  public search(
    pa?: string,
    nav?: string,
    iuv?: string,
    token?: string,
    idCarrello?: string,
    info?: string,
    offset?: number,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<IRawUnifiedSearchResponse>>;
  public search(
    pa?: string,
    nav?: string,
    iuv?: string,
    token?: string,
    idCarrello?: string,
    info?: string,
    offset?: number,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<IRawUnifiedSearchResponse>>;
  public search(
    pa?: string,
    nav?: string,
    iuv?: string,
    token?: string,
    idCarrello?: string,
    info?: string,
    offset?: number,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (pa != null) queryParameters = queryParameters.set('pa', pa);
    if (nav != null) queryParameters = queryParameters.set('nav', nav);
    if (iuv != null) queryParameters = queryParameters.set('iuv', iuv);
    if (token != null) queryParameters = queryParameters.set('token', token);
    if (idCarrello != null) queryParameters = queryParameters.set('idCarrello', idCarrello);
    if (info != null) queryParameters = queryParameters.set('info', info);
    if (offset != null) queryParameters = queryParameters.set('offset', offset.toString());

    let headers = this.defaultHeaders;
    const accept = this.configuration.selectHeaderAccept(['application/json']);
    if (accept) headers = headers.set('Accept', accept);

    return this.httpClient.request<IRawUnifiedSearchResponse>('get', `${this.basePath}/api/search`, {
      params: queryParameters,
      withCredentials: this.configuration.withCredentials,
      headers,
      observe,
      reportProgress,
    });
  }

  // ─── GET /api/position/{nav}/{pa-emittente} ───────────────────────────────

  public getPosition(nav: string, paEmittente: string, observe?: 'body', reportProgress?: boolean): Observable<IRawPositionPayment>;
  public getPosition(
    nav: string,
    paEmittente: string,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<IRawPositionPayment>>;
  public getPosition(
    nav: string,
    paEmittente: string,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<IRawPositionPayment>>;
  public getPosition(nav: string, paEmittente: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (!nav) throw new Error('Required parameter nav was null or undefined when calling getPosition.');
    if (!paEmittente) throw new Error('Required parameter paEmittente was null or undefined when calling getPosition.');

    let headers = this.defaultHeaders;
    const accept = this.configuration.selectHeaderAccept(['application/json']);
    if (accept) headers = headers.set('Accept', accept);

    return this.httpClient.request<IRawPositionPayment>(
      'get',
      `${this.basePath}/api/position/${encodeURIComponent(nav)}/${encodeURIComponent(paEmittente)}`,
      { withCredentials: this.configuration.withCredentials, headers, observe, reportProgress },
    );
  }

  // ─── GET /api/token/{token} ───────────────────────────────────────────────

  public getTokenInfo(token: string, observe?: 'body', reportProgress?: boolean): Observable<IRawTokenInfo>;
  public getTokenInfo(token: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<IRawTokenInfo>>;
  public getTokenInfo(token: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<IRawTokenInfo>>;
  public getTokenInfo(token: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (!token) throw new Error('Required parameter token was null or undefined when calling getTokenInfo.');

    let headers = this.defaultHeaders;
    const accept = this.configuration.selectHeaderAccept(['application/json']);
    if (accept) headers = headers.set('Accept', accept);

    return this.httpClient.request<IRawTokenInfo>('get', `${this.basePath}/api/token/${encodeURIComponent(token)}`, {
      withCredentials: this.configuration.withCredentials,
      headers,
      observe,
      reportProgress,
    });
  }

  // ─── GET /api/extra/{token} ───────────────────────────────────────────────

  public getExtraInfo(token: string, observe?: 'body', reportProgress?: boolean): Observable<IRawExtraInfoResponse>;
  public getExtraInfo(token: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<IRawExtraInfoResponse>>;
  public getExtraInfo(token: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<IRawExtraInfoResponse>>;
  public getExtraInfo(token: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (!token) throw new Error('Required parameter token was null or undefined when calling getExtraInfo.');

    let headers = this.defaultHeaders;
    const accept = this.configuration.selectHeaderAccept(['application/json']);
    if (accept) headers = headers.set('Accept', accept);

    return this.httpClient.request<IRawExtraInfoResponse>('get', `${this.basePath}/api/extra/${encodeURIComponent(token)}`, {
      withCredentials: this.configuration.withCredentials,
      headers,
      observe,
      reportProgress,
    });
  }

  // ─── GET /api/transfers/{nav}/{pa-emittente}/{token} ─────────────────────

  public getTransfers(
    nav: string,
    paEmittente: string,
    token: string,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<IRawTransferPayment>;
  public getTransfers(
    nav: string,
    paEmittente: string,
    token: string,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<IRawTransferPayment>>;
  public getTransfers(
    nav: string,
    paEmittente: string,
    token: string,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<IRawTransferPayment>>;
  public getTransfers(
    nav: string,
    paEmittente: string,
    token: string,
    observe: any = 'body',
    reportProgress: boolean = false,
  ): Observable<any> {
    if (!nav) throw new Error('Required parameter nav was null or undefined when calling getTransfers.');
    if (!paEmittente) throw new Error('Required parameter paEmittente was null or undefined when calling getTransfers.');
    if (!token) throw new Error('Required parameter token was null or undefined when calling getTransfers.');

    let headers = this.defaultHeaders;
    const accept = this.configuration.selectHeaderAccept(['application/json']);
    if (accept) headers = headers.set('Accept', accept);

    return this.httpClient.request<IRawTransferPayment>(
      'get',
      `${this.basePath}/api/transfers/${encodeURIComponent(nav)}/${encodeURIComponent(paEmittente)}/${encodeURIComponent(token)}`,
      { withCredentials: this.configuration.withCredentials, headers, observe, reportProgress },
    );
  }

  // ─── GET /api/workflows/{nav}/{pa-emittente} ──────────────────────────────

  public getWorkflows(nav: string, paEmittente: string, observe?: 'body', reportProgress?: boolean): Observable<IRawWorkflowResponse>;
  public getWorkflows(
    nav: string,
    paEmittente: string,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<IRawWorkflowResponse>>;
  public getWorkflows(
    nav: string,
    paEmittente: string,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<IRawWorkflowResponse>>;
  public getWorkflows(nav: string, paEmittente: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (!nav) throw new Error('Required parameter nav was null or undefined when calling getWorkflows.');
    if (!paEmittente) throw new Error('Required parameter paEmittente was null or undefined when calling getWorkflows.');

    let headers = this.defaultHeaders;
    const accept = this.configuration.selectHeaderAccept(['application/json']);
    if (accept) headers = headers.set('Accept', accept);

    return this.httpClient.request<IRawWorkflowResponse>(
      'get',
      `${this.basePath}/api/workflows/${encodeURIComponent(nav)}/${encodeURIComponent(paEmittente)}`,
      { withCredentials: this.configuration.withCredentials, headers, observe, reportProgress },
    );
  }
}
