import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { BulkLifecycleAction, SearchInstanceDTO } from '../models/bulk-search.model';

@Injectable({ providedIn: 'root' })
export class BulkSearchService {
  private readonly http = inject(HttpClient);
  private readonly resourceUrl = inject(ApplicationConfigService).getEndpointFor('api/bulk/search-instances');

  list(): Observable<SearchInstanceDTO[]> {
    return this.http.get<SearchInstanceDTO[]>(this.resourceUrl);
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

  validateCsv(id: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.resourceUrl}/${encodeURIComponent(id)}/csv/validate`, {});
  }

  getLastResult(id: string): Observable<unknown> {
    return this.http.get<unknown>(`${this.resourceUrl}/${encodeURIComponent(id)}/last-result`);
  }

  download(id: string): Observable<Blob> {
    return this.http.get(`${this.resourceUrl}/${encodeURIComponent(id)}/download`, { responseType: 'blob' });
  }
}
