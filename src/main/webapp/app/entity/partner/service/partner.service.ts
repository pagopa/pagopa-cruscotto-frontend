import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IPartner } from '../partner.model';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT, DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';

type PartnerRestOf<T extends IPartner> = Omit<
  T,
  'createdDate' | 'lastModifiedDate' | 'lastAnalysisDate' | 'analysisPeriodStartDate' | 'analysisPeriodEndDate'
> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  lastAnalysisDate?: string | null;
  analysisPeriodStartDate?: string | null;
  analysisPeriodEndDate?: string | null;
};

export type RestPartner = PartnerRestOf<IPartner>;

type EntityResponseType = HttpResponse<IPartner>;
type EntityArrayResponseType = HttpResponse<IPartner[]>;

@Injectable({ providedIn: 'root' })
export class PartnerService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/anag-partners');

  private subject = new Subject<{ partnerId: string | null; reset: boolean; change: boolean }>();

  sendPartnerId(arg1: string | null, arg2: boolean, arg3: boolean): void {
    this.subject.next({ partnerId: arg1, reset: arg2, change: arg3 });
  }

  getPartnerId(): Observable<{ partnerId: string | null; reset: boolean; change: boolean }> {
    return this.subject.asObservable();
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPartner[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertPartnerResponseArrayFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPartner>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  protected convertResponseFromServer(res: HttpResponse<RestPartner>): HttpResponse<IPartner> {
    return res.clone({
      body: res.body ? this.convertPartnerFromServer(res.body) : null,
    });
  }

  protected convertPartnerResponseArrayFromServer(res: HttpResponse<RestPartner[]>): HttpResponse<IPartner[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertPartnerFromServer(item)) : null,
    });
  }

  protected convertPartnerFromServer(restPartner: RestPartner): IPartner {
    return {
      ...restPartner,
      deactivationDate: restPartner.deactivationDate ? dayjs(restPartner.deactivationDate, DATE_FORMAT) : undefined,
      createdDate: restPartner.createdDate ? dayjs(restPartner.createdDate, DATE_TIME_FORMAT_ISO) : undefined,
      lastModifiedDate: restPartner.lastModifiedDate ? dayjs(restPartner.lastModifiedDate, DATE_TIME_FORMAT_ISO) : undefined,
      analysisPeriodEndDate: restPartner.analysisPeriodEndDate ? dayjs(restPartner.analysisPeriodEndDate, DATE_FORMAT) : undefined,
      analysisPeriodStartDate: restPartner.analysisPeriodStartDate ? dayjs(restPartner.analysisPeriodStartDate, DATE_FORMAT) : undefined,
      lastAnalysisDate: restPartner.lastAnalysisDate ? dayjs(restPartner.lastAnalysisDate, DATE_FORMAT) : undefined,
    };
  }
}
