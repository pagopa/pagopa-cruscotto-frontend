import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IStation } from '../station.model';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT, DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';

type StationRestOf<T extends IStation> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestStation = StationRestOf<IStation>;

type EntityResponseType = HttpResponse<IStation>;
type EntityArrayResponseType = HttpResponse<IStation[]>;

@Injectable({ providedIn: 'root' })
export class StationService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/stations');

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertStationResponseArrayFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  protected convertResponseFromServer(res: HttpResponse<RestStation>): HttpResponse<IStation> {
    return res.clone({
      body: res.body ? this.convertStationFromServer(res.body) : null,
    });
  }

  protected convertStationResponseArrayFromServer(res: HttpResponse<RestStation[]>): HttpResponse<IStation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertStationFromServer(item)) : null,
    });
  }

  protected convertStationFromServer(restStation: RestStation): IStation {
    return {
      ...restStation,
      deactivationDate: restStation.deactivationDate ? dayjs(restStation.deactivationDate, DATE_FORMAT) : undefined,
      activationDate: restStation.activationDate ? dayjs(restStation.activationDate, DATE_FORMAT) : undefined,
      createdDate: restStation.createdDate ? dayjs(restStation.createdDate, DATE_TIME_FORMAT_ISO) : undefined,
      lastModifiedDate: restStation.lastModifiedDate ? dayjs(restStation.lastModifiedDate, DATE_TIME_FORMAT_ISO) : undefined,
    };
  }
}
