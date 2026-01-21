import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { GenerateReportRequest } from '../models/report.model';

type EntityResponseType = HttpResponse<any>;
type EntityArrayResponseType = HttpResponse<any[]>;

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/reports');

  generate(request: GenerateReportRequest): Observable<EntityResponseType> {
    // const copy = this.convertDateFromClient(instance);
    return this.http.post<EntityResponseType>(`${this.resourceUrl}/generate-async`, request, { observe: 'response' });
    //   .pipe(map(res => this.convertResponseFromServer(res)));
  }
}
