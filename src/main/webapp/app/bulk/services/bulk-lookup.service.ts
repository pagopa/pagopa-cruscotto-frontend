import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { PageDTO, PageString, LookupOption, PageLookupOption } from '../models/bulk-search.model';

export interface BulkLookupPageRequest {
  page?: number;
  size?: number;
  search?: string;
  sort?: string[];
}

@Injectable({ providedIn: 'root' })
export class BulkLookupService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = inject(ApplicationConfigService).getSertEndpointFor('api/bulk/lookups');
  private readonly sessionCachePrefix = 'pagopa-cruscotto.bulk-lookups.v2';

  touchpoints(request?: BulkLookupPageRequest): Observable<PageString> {
    return this.get<PageString>('touchpoints', request);
  }

  paymentMethods(request?: BulkLookupPageRequest): Observable<PageString> {
    return this.get<PageString>('payment-methods', request);
  }

  stations(request?: BulkLookupPageRequest): Observable<PageLookupOption> {
    return this.get<PageLookupOption>('stations', request);
  }

  psp(request?: BulkLookupPageRequest): Observable<PageLookupOption> {
    return this.get<PageLookupOption>('psp', request);
  }

  intermediaries(request?: BulkLookupPageRequest): Observable<PageLookupOption> {
    return this.get<PageLookupOption>('intermediaries', request);
  }

  intermediariesPsp(request?: BulkLookupPageRequest): Observable<PageLookupOption> {
    return this.get<PageLookupOption>('intermediaries-psp', request);
  }

  creditorInstitutions(request?: BulkLookupPageRequest): Observable<PageLookupOption> {
    return this.get<PageLookupOption>('creditor-institutions', request);
  }

  channels(request?: BulkLookupPageRequest): Observable<PageLookupOption> {
    return this.get<PageLookupOption>('channels', request);
  }

  private get<T>(path: string, request?: BulkLookupPageRequest): Observable<T> {
    let params = new HttpParams();
    if (request?.page != null) params = params.set('page', request.page);
    if (request?.size != null) params = params.set('size', request.size);
    if (request?.search) params = params.set('search', request.search);
    request?.sort?.forEach(sort => (params = params.append('sort', sort)));

    const cacheKey = `${this.sessionCachePrefix}.${path}.${params.toString() || 'default'}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        return of(JSON.parse(cached) as T);
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    return this.http.get<T | T[]>(`${this.resourceUrl}/${path}`, { params }).pipe(
      map(response => (Array.isArray(response) ? ({ content: response } as T) : response)),
      tap(response => sessionStorage.setItem(cacheKey, JSON.stringify(response))),
    );
  }
}
