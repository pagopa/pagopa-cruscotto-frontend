import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IInstance } from '../instance.model';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT, DATE_TIME_FORMAT_ISO } from '../../../config/input.constants';

type InstanceRestOf<T extends IInstance> = Omit<
  T,
  'predictedDateAnalysis' | 'applicationDate' | 'analysisPeriodStartDate' | 'analysisPeriodEndDate' | 'lastAnalysisDate'
> & {
  predictedDateAnalysis?: string | null;
  applicationDate?: string | null;
  analysisPeriodStartDate?: string | null;
  analysisPeriodEndDate?: string | null;
  lastAnalysisDate?: string | null;
};

export type RestInstance = InstanceRestOf<IInstance>;

type EntityArrayResponseType = HttpResponse<IInstance[]>;

@Injectable({ providedIn: 'root' })
export class InstanceService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/instances');

  // create(authPermission: NewPermission): Observable<EntityResponseType> {
  //   return this.http.post<IPermission>(this.resourceUrl, authPermission, { observe: 'response' });
  // }
  //
  // update(authPermission: IPermission): Observable<EntityResponseType> {
  //   return this.http.put<IPermission>(this.resourceUrl, authPermission, { observe: 'response' });
  // }
  //
  // find(id: number): Observable<EntityResponseType> {
  //   return this.http.get<IPermission>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  // }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInstance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertInstanceResponseArrayFromServer(res)));
  }

  // findAllByFunction(req?: any, idFunction?: number): Observable<EntityArrayResponseType> {
  //   const options = createRequestOption(req);
  //   return this.http.get<IPermission[]>(`${this.resourceUrl}/auth-function/${idFunction}`, { params: options, observe: 'response' });
  // }
  //
  // delete(id: number): Observable<HttpResponse<{}>> {
  //   return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  // }
  //
  // findAssociatePermissionsToFunction(functionId?: number, req?: any): Observable<EntityArrayResponseType> {
  //   const options = createRequestOption(req);
  //   return this.http.get<IPermission[]>(`${this.resourceUrl}/auth-function/${functionId}`, {
  //     params: options,
  //     observe: 'response',
  //   });
  // }
  //
  // findPermessiAssociabiliByFunzione(functionId?: number, req?: any): Observable<EntityArrayResponseType> {
  //   const options = createRequestOption(req);
  //   return this.http.get<IPermission[]>(`${this.resourceUrl}/auth-function/${functionId}/associabili`, {
  //     params: options,
  //     observe: 'response',
  //   });
  // }

  protected convertInstanceResponseArrayFromServer(res: HttpResponse<RestInstance[]>): HttpResponse<IInstance[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertInstanceFromServer(item)) : null,
    });
  }

  protected convertInstanceFromServer(restInstance: RestInstance): IInstance {
    return {
      ...restInstance,
      predictedDateAnalysis: restInstance.predictedDateAnalysis ? dayjs(restInstance.predictedDateAnalysis, DATE_FORMAT) : undefined,
      applicationDate: restInstance.applicationDate ? dayjs(restInstance.applicationDate, DATE_TIME_FORMAT_ISO) : undefined,
      analysisPeriodStartDate: restInstance.analysisPeriodStartDate ? dayjs(restInstance.analysisPeriodStartDate, DATE_FORMAT) : undefined,
      analysisPeriodEndDate: restInstance.analysisPeriodEndDate ? dayjs(restInstance.analysisPeriodEndDate, DATE_FORMAT) : undefined,
      lastAnalysisDate: restInstance.lastAnalysisDate ? dayjs(restInstance.lastAnalysisDate, DATE_TIME_FORMAT_ISO) : undefined,
    };
  }
}
