import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

import { ApplicationConfigService } from '../../../../core/config/application-config.service';
import { createRequestOption } from '../../../../core/request/request-util';
import {
  IEventoDettaglio,
  IOperazioneRicercaResponse,
  IPosizioneDettaglioFull,
  ITokenDettaglio,
  MOCK_EVENTO_DETTAGLIO,
  MOCK_POSIZIONE_DETTAGLIO_FULL,
  MOCK_RICERCA_OPERAZIONI_RESPONSE,
  MOCK_TOKEN_DETTAGLIO,
} from '../models/ricerca-operazioni.model';

@Injectable({ providedIn: 'root' })
export class RicercaOperazioniService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  // ⚠️ INTEGRARE con il base path reale delle API (es. 'api/ricerca-operazioni')
  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/ricerca-operazioni');

  /**
   * GET /search/{nav} — Ricerca per Codice Avviso (NAV)
   */
  searchByNav(nav: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    // TODO: sostituire con la chiamata HTTP reale:
    // const options = createRequestOption({ ...req, paEmittente });
    // return this.http.get<IOperazioneRicercaResponse>(`${this.resourceUrl}/search/${nav}`, { params: options, observe: 'response' });
    return of(new HttpResponse({ body: MOCK_RICERCA_OPERAZIONI_RESPONSE, status: 200 })).pipe(delay(300));
  }

  /**
   * GET /search/{iuv} — Ricerca per IUV o Creditor Reference ID
   */
  searchByIuv(iuv: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    // TODO: sostituire con la chiamata HTTP reale:
    // const options = createRequestOption({ ...req, paEmittente });
    // return this.http.get<IOperazioneRicercaResponse>(`${this.resourceUrl}/search/${iuv}`, { params: options, observe: 'response' });
    return of(new HttpResponse({ body: MOCK_RICERCA_OPERAZIONI_RESPONSE, status: 200 })).pipe(delay(300));
  }

  /**
   * GET /search/{token} — Ricerca per token
   */
  searchByToken(token: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    // TODO: sostituire con la chiamata HTTP reale:
    // const options = createRequestOption({ ...req, paEmittente });
    // return this.http.get<IOperazioneRicercaResponse>(`${this.resourceUrl}/search/${token}`, { params: options, observe: 'response' });
    return of(new HttpResponse({ body: MOCK_RICERCA_OPERAZIONI_RESPONSE, status: 200 })).pipe(delay(300));
  }

  /**
   * GET /search/cart/{id_cart} — Ricerca per ID Carrello
   */
  searchByCart(idCart: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    // TODO: sostituire con la chiamata HTTP reale:
    // const options = createRequestOption({ ...req, paEmittente });
    // return this.http.get<IOperazioneRicercaResponse>(`${this.resourceUrl}/search/cart/${idCart}`, { params: options, observe: 'response' });
    return of(new HttpResponse({ body: MOCK_RICERCA_OPERAZIONI_RESPONSE, status: 200 })).pipe(delay(300));
  }

  /**
   * GET /search/extra/{searchValue} — Ricerca per Informazioni Aggiuntive
   */
  searchByExtra(searchValue: string, paEmittente?: string, req?: any): Observable<HttpResponse<IOperazioneRicercaResponse>> {
    // TODO: sostituire con la chiamata HTTP reale:
    // const options = createRequestOption({ ...req, paEmittente });
    // return this.http.get<IOperazioneRicercaResponse>(`${this.resourceUrl}/search/extra/${searchValue}`, { params: options, observe: 'response' });
    return of(new HttpResponse({ body: MOCK_RICERCA_OPERAZIONI_RESPONSE, status: 200 })).pipe(delay(300));
  }

  /**
   * GET /position/{positionId} — Dettaglio posizione con tokens ed eventi
   */
  getPosizioneDettaglio(positionId: string): Observable<HttpResponse<IPosizioneDettaglioFull>> {
    // TODO: sostituire con la chiamata HTTP reale:
    // return this.http.get<IPosizioneDettaglioFull>(`${this.resourceUrl}/position/${positionId}`, { observe: 'response' });
    return of(new HttpResponse({ body: MOCK_POSIZIONE_DETTAGLIO_FULL, status: 200 })).pipe(delay(300));
  }

  /**
   * Carica il dettaglio espanso di un token
   */
  getTokenDettaglio(token: string): Observable<ITokenDettaglio> {
    // TODO: sostituire con la chiamata HTTP reale:
    // return this.http.get<ITokenDettaglio>(`${this.resourceUrl}/token/${token}/detail`);
    return of(MOCK_TOKEN_DETTAGLIO).pipe(delay(200));
  }

  /**
   * Carica il dettaglio espanso di un evento
   */
  getEventoDettaglio(eventoId: string): Observable<IEventoDettaglio> {
    // TODO: sostituire con la chiamata HTTP reale:
    // return this.http.get<IEventoDettaglio>(`${this.resourceUrl}/evento/${eventoId}/detail`);
    return of(MOCK_EVENTO_DETTAGLIO).pipe(delay(200));
  }
}
