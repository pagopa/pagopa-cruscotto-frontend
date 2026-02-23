import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { GenerateReportRequest } from '../models/report.model';

type EntityResponseType = HttpResponse<any>;

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/reports');

  checkStatus(id: number): Observable<EntityResponseType> {
    return this.http.get<EntityResponseType>(`${this.resourceUrl}/${id}/status`, { observe: 'response' });
  }

  generate(request: GenerateReportRequest): Observable<EntityResponseType> {
    return this.http.post<EntityResponseType>(`${this.resourceUrl}/generate-async`, request, { observe: 'response' });
  }
}
