import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { IKpiConfiguration, NewKpiConfiguration } from '../kpi-configuration.model';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type EntityResponseType = HttpResponse<IKpiConfiguration>;
type EntityArrayResponseType = HttpResponse<IKpiConfiguration[]>;

@Injectable({ providedIn: 'root' })
export class KpiConfigurationService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/kpi-configurations');

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IKpiConfiguration[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  find(moduleCode: string): Observable<EntityResponseType> {
    return this.http.get<IKpiConfiguration>(`${this.resourceUrl}/${moduleCode}`, { observe: 'response' });
  }

  create(kpiConfiguration: NewKpiConfiguration): Observable<EntityResponseType> {
    return this.http.post<IKpiConfiguration>(this.resourceUrl, kpiConfiguration, { observe: 'response' });
  }

  update(kpiConfiguration: IKpiConfiguration): Observable<EntityResponseType> {
    return this.http.put<IKpiConfiguration>(this.resourceUrl, kpiConfiguration, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
