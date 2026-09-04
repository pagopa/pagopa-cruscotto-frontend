import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import {
  PageAnagCanale,
  PageAnagIntermediarioPa,
  PageAnagIntermediarioPsp,
  PageAnagPaEmittente,
  PageAnagPsp,
  PageAnagStazione,
  PageString,
} from '../models/bulk-search.model';

export interface BulkLookupPageRequest {
  page?: number;
  size?: number;
  sort?: string[];
}

@Injectable({ providedIn: 'root' })
export class BulkLookupService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = inject(ApplicationConfigService).getEndpointFor('api/bulk/lookups');

  touchpoints(request?: BulkLookupPageRequest): Observable<PageString> {
    return this.get<PageString>('touchpoints', request);
  }

  stations(request?: BulkLookupPageRequest): Observable<PageAnagStazione> {
    return this.get<PageAnagStazione>('stations', request);
  }

  psp(request?: BulkLookupPageRequest): Observable<PageAnagPsp> {
    return this.get<PageAnagPsp>('psp', request);
  }

  paymentMethods(request?: BulkLookupPageRequest): Observable<PageString> {
    return this.get<PageString>('payment-methods', request);
  }

  intermediaries(request?: BulkLookupPageRequest): Observable<PageAnagIntermediarioPa> {
    return this.get<PageAnagIntermediarioPa>('intermediaries', request);
  }

  intermediariesPsp(request?: BulkLookupPageRequest): Observable<PageAnagIntermediarioPsp> {
    return this.get<PageAnagIntermediarioPsp>('intermediaries-psp', request);
  }

  creditorInstitutions(request?: BulkLookupPageRequest): Observable<PageAnagPaEmittente> {
    return this.get<PageAnagPaEmittente>('creditor-institutions', request);
  }

  channels(request?: BulkLookupPageRequest): Observable<PageAnagCanale> {
    return this.get<PageAnagCanale>('channels', request);
  }

  private get<T>(path: string, request?: BulkLookupPageRequest): Observable<T> {
    let params = new HttpParams();
    if (request?.page != null) params = params.set('page', request.page);
    if (request?.size != null) params = params.set('size', request.size);
    request?.sort?.forEach(sort => (params = params.append('sort', sort)));
    return this.http.get<T>(`${this.resourceUrl}/${path}`, { params });
  }
}
