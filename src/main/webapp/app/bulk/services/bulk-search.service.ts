import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { BulkLifecycleAction, CsvValidationResult, PageDTO, SearchInstanceDTO } from '../models/bulk-search.model';

export interface BulkSearchPageRequest {
  page?: number;
  size?: number;
  sort?: string[];
}

@Injectable({ providedIn: 'root' })
export class BulkSearchService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = inject(ApplicationConfigService).getSertEndpointFor('api/bulk/search-instances');

  list(request?: BulkSearchPageRequest): Observable<PageDTO<SearchInstanceDTO>> {
    let params = new HttpParams();
    if (request?.page != null) params = params.set('page', request.page);
    if (request?.size != null) params = params.set('size', request.size);
    request?.sort?.forEach(sort => (params = params.append('sort', sort)));

    return this.http
      .get<SearchInstanceDTO[] | PageDTO<SearchInstanceDTO>>(this.resourceUrl, { params })
      .pipe(map(response => (Array.isArray(response) ? { content: response, totalElements: response.length } : response)));
  }

  get(id: string): Observable<SearchInstanceDTO> {
    return this.http.get<SearchInstanceDTO>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  create(searchInstance: SearchInstanceDTO): Observable<SearchInstanceDTO> {
    return this.http.post<SearchInstanceDTO>(this.resourceUrl, searchInstance);
  }

  update(id: string, searchInstance: SearchInstanceDTO): Observable<SearchInstanceDTO> {
    return this.http.put<SearchInstanceDTO>(`${this.resourceUrl}/${encodeURIComponent(id)}`, searchInstance);
  }

  delete(id: string): Observable<HttpResponse<unknown>> {
    return this.http.delete<unknown>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  lifecycleAction(id: string, action: BulkLifecycleAction): Observable<Record<string, unknown>> {
    return this.http.post<Record<string, unknown>>(`${this.resourceUrl}/${encodeURIComponent(id)}/${action}`, {});
  }

  rerun(id: string): Observable<unknown> {
    return this.http.post<unknown>(`${this.resourceUrl}/${encodeURIComponent(id)}/rerun`, {});
  }

  execute(id: string): Observable<unknown> {
    return this.http.post<unknown>(`${this.resourceUrl}/${encodeURIComponent(id)}/execute`, {});
  }

  uploadCsv(id: string, file: File | Blob): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<unknown>(`${this.resourceUrl}/${encodeURIComponent(id)}/csv`, formData);
  }

  createFromCsv(name: string, file: File | Blob): Observable<SearchInstanceDTO> {
    const formData = new FormData();
    formData.append('file', file);
    const params = new HttpParams().set('name', name);
    return this.http.post<SearchInstanceDTO>(`${this.resourceUrl}/csv`, formData, { params });
  }

  validateCsvFile(file: File | Blob): Observable<CsvValidationResult | null> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CsvValidationResult>(`${this.resourceUrl}/csv/validate-file`, formData);
  }

  getLastResult(id: string): Observable<unknown> {
    return this.http.get<unknown>(`${this.resourceUrl}/${encodeURIComponent(id)}/last-result`);
  }

  download(id: string): Observable<Blob> {
    return this.http.get(`${this.resourceUrl}/${encodeURIComponent(id)}/download`, { responseType: 'blob' });
  }

  downloadCsv(id: string): Observable<Blob> {
    return this.http.get(`${this.resourceUrl}/${encodeURIComponent(id)}/perimeter/download`, { responseType: 'blob' });
  }
}
