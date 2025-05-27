import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';

import dayjs from 'dayjs/esm';
import { DATE_FORMAT, DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';
import { ITaxonomy } from '../taxonomy.model';

type TaxonomyRestOf<T extends ITaxonomy> = Omit<T, 'validityStartDate' | 'validityEndDate' | 'createdDate' | 'lastModifiedDate'> & {
  validityStartDate?: string | null;
  validityEndDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestTaxonomy = TaxonomyRestOf<ITaxonomy>;

type EntityResponseType = HttpResponse<ITaxonomy>;
type EntityArrayResponseType = HttpResponse<ITaxonomy[]>;

@Injectable({ providedIn: 'root' })
export class TaxonomyService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/taxonomies');

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTaxonomy[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertTaxonomyResponseArrayFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTaxonomy>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  protected convertResponseFromServer(res: HttpResponse<RestTaxonomy>): HttpResponse<ITaxonomy> {
    return res.clone({
      body: res.body ? this.convertTaxonomyFromServer(res.body) : null,
    });
  }

  protected convertTaxonomyResponseArrayFromServer(res: HttpResponse<RestTaxonomy[]>): HttpResponse<ITaxonomy[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertTaxonomyFromServer(item)) : null,
    });
  }

  protected convertTaxonomyFromServer(restTaxonomy: RestTaxonomy): ITaxonomy {
    return {
      ...restTaxonomy,
      validityStartDate: restTaxonomy.validityStartDate ? dayjs(restTaxonomy.validityStartDate, DATE_FORMAT) : undefined,
      validityEndDate: restTaxonomy.validityEndDate ? dayjs(restTaxonomy.validityEndDate, DATE_FORMAT) : undefined,
      createdDate: restTaxonomy.createdDate ? dayjs(restTaxonomy.createdDate, DATE_TIME_FORMAT_ISO) : undefined,
      lastModifiedDate: restTaxonomy.lastModifiedDate ? dayjs(restTaxonomy.lastModifiedDate, DATE_TIME_FORMAT_ISO) : undefined,
    };
  }
}
