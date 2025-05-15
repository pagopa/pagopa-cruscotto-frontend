import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IShutdown, NewShutdown, TypePlanned } from '../shutdown.model';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT_ISO, DATE_TIME_FORMAT } from 'app/config/input.constants';

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
    const copy = this.convertShutdownFromClient(shutdown);
    return this.http
      .post<RestShutdown>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(shutdown: IShutdown): Observable<EntityResponseType> {
    const copy = this.convertShutdownFromClient(shutdown);
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

  protected convertShutdownFromClient<T extends IShutdown | NewShutdown>(shutdown: T): ShutdownRestOf<T> {
    let startDate = shutdown.shutdownStartDate?.clone();
    const startHour = shutdown.shutdownStartHour;

    if (startDate && startHour) {
      startDate = startDate.hour(startHour.getHours());
      startDate = startDate.minute(startHour.getMinutes());
    }

    let endDate = shutdown.shutdownEndDate?.clone();
    const endHour = shutdown.shutdownEndHour;

    if (endDate && endHour) {
      endDate = endDate.hour(endHour.getHours());
      endDate = endDate.minute(endHour.getMinutes());
    }

    let result = {
      ...shutdown,
      shutdownStartDate: startDate?.format(DATE_TIME_FORMAT) ?? null,
      shutdownEndDate: endDate?.format(DATE_TIME_FORMAT) ?? null,
    };

    delete result.shutdownStartHour;
    delete result.shutdownEndHour;

    return result;
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
    const startDate = restShutdown.shutdownStartDate;
    let shutdownStartDate;
    let startHour;
    if (startDate) {
      shutdownStartDate = dayjs(startDate, DATE_TIME_FORMAT_ISO);
      startHour = shutdownStartDate.clone().toDate();
      startHour.setHours(shutdownStartDate.toDate().getHours());
    }
    const endDate = restShutdown.shutdownEndDate;
    let shutdownEndDate;
    let endHour;
    if (endDate) {
      shutdownEndDate = dayjs(endDate, DATE_TIME_FORMAT_ISO);
      endHour = shutdownEndDate.clone().toDate();
      endHour.setHours(shutdownEndDate.toDate().getHours());
    }

    return {
      ...restShutdown,
      typePlanned: restShutdown.typePlanned == 'PROGRAMMATO' ? TypePlanned.PROGRAMMATO : TypePlanned.NON_PROGRAMMATO,
      shutdownStartDate: shutdownStartDate,
      shutdownEndDate: shutdownEndDate,
      shutdownStartHour: startHour,
      shutdownEndHour: endHour,
    };
  }
}
