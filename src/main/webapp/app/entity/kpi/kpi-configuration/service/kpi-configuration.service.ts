import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { IKpiConfiguration, NewKpiConfiguration } from '../kpi-configuration.model';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';

type KpiConfigurationRestOf<T extends IKpiConfiguration | NewKpiConfiguration> = Omit<
  T,
  'eligibilityThreshold' | 'tolerance' | 'averageTimeLimit'
> & {
  eligibilityThreshold?: number | null;
  tolerance?: number | null;
  averageTimeLimit?: number | null;
  excludePlannedShutdown?: boolean | null;
  excludeUnplannedShutdown?: boolean | null;
};

type EntityResponseType = HttpResponse<IKpiConfiguration>;
type EntityArrayResponseType = HttpResponse<IKpiConfiguration[]>;

export type RestKpiConfiguration = KpiConfigurationRestOf<IKpiConfiguration>;

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
    const copy = this.convertDateFromClient(kpiConfiguration);
    return this.http
      .post<RestKpiConfiguration>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(kpiConfiguration: IKpiConfiguration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kpiConfiguration);
    return this.http
      .put<RestKpiConfiguration>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient<T extends IKpiConfiguration | NewKpiConfiguration>(kpiConfiguration: T): KpiConfigurationRestOf<T> {
    return {
      ...kpiConfiguration,
      eligibilityThreshold: kpiConfiguration.eligibilityThreshold
        ? this.convertStringToNumber(kpiConfiguration.eligibilityThreshold)
        : null,
      tolerance: kpiConfiguration.tolerance ? this.convertStringToNumber(kpiConfiguration.tolerance) : null,
      averageTimeLimit: kpiConfiguration.averageTimeLimit ? this.convertStringToNumber(kpiConfiguration.averageTimeLimit) : null,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestKpiConfiguration>): HttpResponse<IKpiConfiguration> {
    return res.clone({
      body: res.body ? this.convertKpiConfigurationFromServer(res.body) : null,
    });
  }

  protected convertKpiConfigurationResponseArrayFromServer(res: HttpResponse<RestKpiConfiguration[]>): HttpResponse<IKpiConfiguration[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertKpiConfigurationFromServer(item)) : null,
    });
  }

  protected convertKpiConfigurationFromServer(restKpiConfiguration: RestKpiConfiguration): IKpiConfiguration {
    return {
      ...restKpiConfiguration,
      eligibilityThreshold: restKpiConfiguration.eligibilityThreshold ? String(restKpiConfiguration.eligibilityThreshold) : null,
      tolerance: restKpiConfiguration.tolerance ? String(restKpiConfiguration.tolerance) : null,
      averageTimeLimit: restKpiConfiguration.averageTimeLimit ? String(restKpiConfiguration.averageTimeLimit) : null,
    };
  }

  private convertStringToNumber(str: string) {
    if (typeof str === 'number') {
      return str;
    } else if (typeof str === 'string') {
      return Number(str.replace(',', '.'));
    } else {
      return null;
    }
  }
}
