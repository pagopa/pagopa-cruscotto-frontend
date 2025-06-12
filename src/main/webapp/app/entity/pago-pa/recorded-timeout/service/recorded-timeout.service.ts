import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../../core/config/application-config.service';

import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from 'app/config/input.constants';
import { IPagoPaRecordedTimeout } from '../recorded-timeout.model';

type PagoPaRecordedTimeoutRestOf<T extends IPagoPaRecordedTimeout> = T & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestPagoPaRecordedTimeout = PagoPaRecordedTimeoutRestOf<IPagoPaRecordedTimeout>;

type EntityResponseType = HttpResponse<IPagoPaRecordedTimeout>;
type EntityArrayResponseType = HttpResponse<IPagoPaRecordedTimeout[]>;

@Injectable({ providedIn: 'root' })
export class RecordedTimeoutService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/pagoPaRecordedTimeouts');

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPagoPaRecordedTimeout[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertPagoPaRecordedTimeoutResponseArrayFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPagoPaRecordedTimeout>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  protected convertResponseFromServer(res: HttpResponse<RestPagoPaRecordedTimeout>): HttpResponse<IPagoPaRecordedTimeout> {
    return res.clone({
      body: res.body ? this.convertPagoPaRecordedTimeoutFromServer(res.body) : null,
    });
  }

  protected convertPagoPaRecordedTimeoutResponseArrayFromServer(
    res: HttpResponse<RestPagoPaRecordedTimeout[]>,
  ): HttpResponse<IPagoPaRecordedTimeout[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertPagoPaRecordedTimeoutFromServer(item)) : null,
    });
  }

  protected convertPagoPaRecordedTimeoutFromServer(restPagoPaRecordedTimeout: RestPagoPaRecordedTimeout): IPagoPaRecordedTimeout {
    return {
      ...restPagoPaRecordedTimeout,
      startDate: restPagoPaRecordedTimeout.startDate ? dayjs(restPagoPaRecordedTimeout.startDate, DATE_FORMAT) : undefined,
      endDate: restPagoPaRecordedTimeout.endDate ? dayjs(restPagoPaRecordedTimeout.endDate, DATE_FORMAT) : undefined,
    };
  }
}
