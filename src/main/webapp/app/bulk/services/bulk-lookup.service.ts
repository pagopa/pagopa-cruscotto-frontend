import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import {
  AnagCanale,
  AnagIntermediarioPa,
  AnagIntermediarioPsp,
  AnagPaEmittente,
  AnagPsp,
  AnagStazione,
  PageAnagCanale,
  PageAnagIntermediarioPa,
  PageAnagIntermediarioPsp,
  PageAnagPaEmittente,
  PageAnagPsp,
  PageAnagStazione,
  PageDTO,
  PageString,
} from '../models/bulk-search.model';

export interface BulkLookupPageRequest {
  page?: number;
  size?: number;
  filter?: string;
  sort?: string[];
}

@Injectable({ providedIn: 'root' })
export class BulkLookupService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = inject(ApplicationConfigService).getSertEndpointFor('api/bulk/lookups');
  private readonly sessionCachePrefix = 'pagopa-cruscotto.bulk-lookups.v2';

  touchpoints(request?: BulkLookupPageRequest): Observable<PageString> {
    return this.get<string>('touchpoints', request);
  }

  stations(request?: BulkLookupPageRequest): Observable<PageAnagStazione> {
    return this.get<AnagStazione>('stations', request);
  }

  psp(request?: BulkLookupPageRequest): Observable<PageAnagPsp> {
    return this.get<AnagPsp>('psp', request);
  }

  paymentMethods(request?: BulkLookupPageRequest): Observable<PageString> {
    return this.get<string>('payment-methods', request);
  }

  intermediaries(request?: BulkLookupPageRequest): Observable<PageAnagIntermediarioPa> {
    return this.get<AnagIntermediarioPa>('intermediaries', request);
  }

  intermediariesPsp(request?: BulkLookupPageRequest): Observable<PageAnagIntermediarioPsp> {
    return this.get<AnagIntermediarioPsp>('intermediaries-psp', request);
  }

  creditorInstitutions(request?: BulkLookupPageRequest): Observable<PageAnagPaEmittente> {
    return this.get<AnagPaEmittente>('creditor-institutions', request);
  }

  channels(request?: BulkLookupPageRequest): Observable<PageAnagCanale> {
    return this.get<AnagCanale>('channels', request);
  }

  private get<T>(path: string, request?: BulkLookupPageRequest): Observable<PageDTO<T>> {
    let params = new HttpParams();
    if (request?.page != null) params = params.set('page', request.page);
    if (request?.size != null) params = params.set('size', request.size);
    if (request?.filter) params = params.set('filter', request.filter);
    request?.sort?.forEach(sort => (params = params.append('sort', sort)));

    const cacheKey = `${this.sessionCachePrefix}.${path}.${params.toString() || 'default'}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        return of(JSON.parse(cached) as PageDTO<T>);
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    return this.http.get<T[] | PageDTO<T>>(`${this.resourceUrl}/${path}`, { params }).pipe(
      map(response => (Array.isArray(response) ? { content: response } : response)),
      tap(response => sessionStorage.setItem(cacheKey, JSON.stringify(response))),
    );
  }
}
