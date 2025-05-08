import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IShutdown, NewShutdown, TypePlanned } from '../shutdown.model';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT, DATE_FORMAT_ISO, DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';

type ShutdownRestOf<T extends IShutdown | NewShutdown> = Omit<T, 'shutdownStartDate' | 'shutdownEndDate'> & {
  shutdownStartDate?: string | null;
  shutdownEndDate?: string | null;
};

export type RestShutdown = ShutdownRestOf<IShutdown>;

export type NewRestShutdown = ShutdownRestOf<NewShutdown>;

export type EntityArrayResponseType = HttpResponse<IShutdown[]>;

export type EntityResponseType = HttpResponse<IShutdown>;

@Injectable({ providedIn: 'root' })
export class ShutdownService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/shutdowns');

  create(shutdown: NewShutdown): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shutdown);
    return this.http
      .post<RestShutdown>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(shutdown: IShutdown): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shutdown);
    return this.http
      .put<RestShutdown>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestShutdown>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestShutdown[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertShutdownResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient<T extends IShutdown | NewShutdown>(shutdown: T): ShutdownRestOf<T> {
    return {
      ...shutdown,
      shutdownStartDate: shutdown.shutdownStartDate?.format(DATE_FORMAT_ISO) ?? null,
      shutdownEndDate: shutdown.shutdownEndDate?.format(DATE_FORMAT_ISO) ?? null,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestShutdown>): HttpResponse<IShutdown> {
    return res.clone({
      body: res.body ? this.convertShutdownFromServer(res.body) : null,
    });
  }

  protected convertShutdownResponseArrayFromServer(res: HttpResponse<RestShutdown[]>): HttpResponse<IShutdown[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertShutdownFromServer(item)) : null,
    });
  }

  protected convertShutdownFromServer(restShutdown: RestShutdown): IShutdown {
    return {
      ...restShutdown,
      typePlanned: restShutdown.typePlanned == 'PROGRAMMATO' ? TypePlanned.PROGRAMMATO : TypePlanned.NON_PROGRAMMATO,
      shutdownStartDate: restShutdown.shutdownStartDate ? dayjs(restShutdown.shutdownStartDate, DATE_FORMAT) : undefined,
      shutdownEndDate: restShutdown.shutdownEndDate ? dayjs(restShutdown.shutdownEndDate, DATE_TIME_FORMAT_ISO) : undefined,
    };
  }
}
