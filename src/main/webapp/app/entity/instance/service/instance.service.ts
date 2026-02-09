import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IInstance, NewInstance } from '../models/instance.model';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT, DATE_FORMAT_ISO, DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';

type InstanceRestOf<T extends IInstance | NewInstance> = Omit<
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

export type NewRestInstance = InstanceRestOf<NewInstance>;

type EntityArrayResponseType = HttpResponse<IInstance[]>;

type EntityResponseType = HttpResponse<IInstance>;

@Injectable({ providedIn: 'root' })
export class InstanceService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/instances');

  create(instance: NewInstance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instance);
    return this.http
      .post<RestInstance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(instance: IInstance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instance);
    return this.http
      .put<RestInstance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInstance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInstance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertInstanceResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  updateStatus(id: number): Observable<HttpResponse<{}>> {
    return this.http.put<HttpResponse<{}>>(`${this.resourceUrl}/update-status/${id}`, { observe: 'response' });
  }

  archive(instanceIds: number[]): Observable<any> {
    return this.http.post(`${this.resourceUrl}/archive`, instanceIds);
  }

  protected convertDateFromClient<T extends IInstance | NewInstance>(instance: T): InstanceRestOf<T> {
    return {
      ...instance,
      predictedDateAnalysis: instance.predictedDateAnalysis?.format(DATE_FORMAT_ISO) ?? null,
      analysisPeriodStartDate: instance.analysisPeriodStartDate?.format(DATE_FORMAT_ISO) ?? null,
      analysisPeriodEndDate: instance.analysisPeriodEndDate?.format(DATE_FORMAT_ISO) ?? null,
      applicationDate: instance.applicationDate?.format(DATE_TIME_FORMAT_ISO) ?? null,
      lastAnalysisDate: instance.lastAnalysisDate?.format(DATE_TIME_FORMAT_ISO) ?? null,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInstance>): HttpResponse<IInstance> {
    return res.clone({
      body: res.body ? this.convertInstanceFromServer(res.body) : null,
    });
  }

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
