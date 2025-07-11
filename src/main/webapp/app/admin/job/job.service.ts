import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ApplicationConfigService } from '../../core/config/application-config.service';
import { IJob, IJobExecution } from './job.model';
import { createRequestOption } from '../../core/request/request-util';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT_ISO } from '../../config/input.constants';

type JobRestOf<T extends IJob> = Omit<T, 'scheduleTime' | 'lastFiredTime' | 'nextFireTime'> & {
  scheduleTime?: string | null;
  lastFiredTime?: string | null;
  nextFireTime?: string | null;
};

export type RestJob = JobRestOf<IJob>;

type ExecutionRestOf<T extends IJobExecution> = Omit<T, 'scheduledTime' | 'initFiredTime' | 'endFiredTime'> & {
  scheduledTime?: string | null;
  initFiredTime?: string | null;
  endFiredTime?: string | null;
};

export type RestExecution = ExecutionRestOf<IJobExecution>;

type EntityResulCodeResponseType = HttpResponse<number>;
type EntityArrayResponseType = HttpResponse<IJob[]>;
type ExecutionArrayResponseType = HttpResponse<IJobExecution[]>;

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/jobs/scheduler');

  query(): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestJob[]>(`${this.resourceUrl}/jobs`, { observe: 'response' })
      .pipe(map(res => this.convertJobResponseArrayFromServer(res)));
  }

  pause(req?: any): Observable<EntityResulCodeResponseType> {
    const options = createRequestOption(req);
    return this.http.get<number>(`${this.resourceUrl}/pause`, { params: options, observe: 'response' });
  }

  resume(req?: any): Observable<EntityResulCodeResponseType> {
    const options = createRequestOption(req);
    return this.http.get<number>(`${this.resourceUrl}/resume`, { params: options, observe: 'response' });
  }

  stop(req?: any): Observable<EntityResulCodeResponseType> {
    const options = createRequestOption(req);
    return this.http.get<number>(`${this.resourceUrl}/stop`, { params: options, observe: 'response' });
  }

  start(req?: any): Observable<EntityResulCodeResponseType> {
    const options = createRequestOption(req);
    return this.http.get<number>(`${this.resourceUrl}/start`, { params: options, observe: 'response' });
  }

  update(req?: any): Observable<EntityResulCodeResponseType> {
    const options = createRequestOption(req);
    return this.http.get<number>(`${this.resourceUrl}/update`, { params: options, observe: 'response' });
  }

  execution(req?: any): Observable<ExecutionArrayResponseType> {
    const options = createRequestOption(req);

    return this.http
      .get<RestExecution[]>(`${this.resourceUrl}/executions`, { params: options, observe: 'response' })
      .pipe(map(res => this.convertExecutionResponseArrayFromServer(res)));
  }

  protected convertJobResponseArrayFromServer(res: HttpResponse<RestJob[]>): HttpResponse<IJob[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertJobFromServer(item)) : null,
    });
  }

  protected convertJobFromServer(restJob: RestJob): IJob {
    return {
      ...restJob,
      scheduleTime: restJob.scheduleTime ? dayjs(restJob.scheduleTime, DATE_TIME_FORMAT_ISO) : undefined,
      lastFiredTime: restJob.lastFiredTime ? dayjs(restJob.lastFiredTime, DATE_TIME_FORMAT_ISO) : undefined,
      nextFireTime: restJob.nextFireTime ? dayjs(restJob.nextFireTime, DATE_TIME_FORMAT_ISO) : undefined,
    };
  }

  protected convertExecutionResponseArrayFromServer(res: HttpResponse<RestExecution[]>): HttpResponse<IJobExecution[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertExecutionFromServer(item)) : null,
    });
  }

  protected convertExecutionFromServer(restExecution: RestExecution): IJobExecution {
    return {
      ...restExecution,
      scheduledTime: restExecution.scheduledTime ? dayjs(restExecution.scheduledTime, DATE_TIME_FORMAT_ISO) : undefined,
      initFiredTime: restExecution.initFiredTime ? dayjs(restExecution.initFiredTime, DATE_TIME_FORMAT_ISO) : undefined,
      endFiredTime: restExecution.endFiredTime ? dayjs(restExecution.endFiredTime, DATE_TIME_FORMAT_ISO) : undefined,
    };
  }
}
