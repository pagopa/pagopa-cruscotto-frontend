import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from '../../../../core/config/application-config.service';
import { IPagoPaTaxonomyAggregatePosition } from '../taxonomy-aggregate-position.model';

type PagoPaTaxonomyAggregatePositionRestOf<T extends IPagoPaTaxonomyAggregatePosition> = T & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestPagoPaTaxonomyAggregatePosition = PagoPaTaxonomyAggregatePositionRestOf<IPagoPaTaxonomyAggregatePosition>;

type EntityResponseType = HttpResponse<IPagoPaTaxonomyAggregatePosition>;
type EntityArrayResponseType = HttpResponse<IPagoPaTaxonomyAggregatePosition[]>;

@Injectable({ providedIn: 'root' })
export class TaxonomyAggregatePositionService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/pago-pa/taxonomy-aggregate-position');

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPagoPaTaxonomyAggregatePosition[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertPagoPaTaxonomyAggregatePositionResponseArrayFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPagoPaTaxonomyAggregatePosition>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  protected convertResponseFromServer(
    res: HttpResponse<RestPagoPaTaxonomyAggregatePosition>,
  ): HttpResponse<IPagoPaTaxonomyAggregatePosition> {
    return res.clone({
      body: res.body ? this.convertPagoPaTaxonomyAggregatePositionFromServer(res.body) : null,
    });
  }

  protected convertPagoPaTaxonomyAggregatePositionResponseArrayFromServer(
    res: HttpResponse<RestPagoPaTaxonomyAggregatePosition[]>,
  ): HttpResponse<IPagoPaTaxonomyAggregatePosition[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertPagoPaTaxonomyAggregatePositionFromServer(item)) : null,
    });
  }

  protected convertPagoPaTaxonomyAggregatePositionFromServer(
    restPagoPaTaxonomyAggregatePosition: RestPagoPaTaxonomyAggregatePosition,
  ): IPagoPaTaxonomyAggregatePosition {
    return {
      ...restPagoPaTaxonomyAggregatePosition,
      startDate: restPagoPaTaxonomyAggregatePosition.startDate
        ? dayjs(restPagoPaTaxonomyAggregatePosition.startDate, DATE_FORMAT)
        : undefined,
      endDate: restPagoPaTaxonomyAggregatePosition.endDate ? dayjs(restPagoPaTaxonomyAggregatePosition.endDate, DATE_FORMAT) : undefined,
    };
  }
}
