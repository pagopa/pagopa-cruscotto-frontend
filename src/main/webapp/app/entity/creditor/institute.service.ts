import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { DATE_TIME_FORMAT_ISO } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IInstitute } from './institute.model';
import dayjs from 'dayjs/esm';

type CreditorRestOf<T extends IInstitute> = Omit<T, 'activationDate' | 'deactivationDate'> & {
  activationDate?: string | null;
  deactivationDate?: string | null;
};

export type RestCreditor = CreditorRestOf<IInstitute>;

type EntityResponseType = HttpResponse<IInstitute>;
type EntityArrayResponseType = HttpResponse<IInstitute[]>;

@Injectable({ providedIn: 'root' })
export class InstituteService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/partners');

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
      .get<RestCreditor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertPartnerResponseArrayFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCreditor>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  protected convertResponseFromServer(res: HttpResponse<RestCreditor>): HttpResponse<IInstitute> {
    return res.clone({
      body: res.body ? this.convertPartnerFromServer(res.body) : null,
    });
  }

  protected convertPartnerResponseArrayFromServer(res: HttpResponse<RestCreditor[]>): HttpResponse<IInstitute[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertPartnerFromServer(item)) : null,
    });
  }

  protected convertPartnerFromServer(restCreditor: RestCreditor): IInstitute {
    return {
      ...restCreditor,
      activationDate: restCreditor.activationDate ? dayjs(restCreditor.activationDate, DATE_TIME_FORMAT_ISO) : undefined,
      deactivationDate: restCreditor.deactivationDate ? dayjs(restCreditor.deactivationDate, DATE_TIME_FORMAT_ISO) : undefined,
      // createdDate: restPartner.createdDate ? dayjs(restPartner.createdDate, DATE_TIME_FORMAT_ISO) : undefined,
      // lastModifiedDate: restPartner.lastModifiedDate ? dayjs(restPartner.lastModifiedDate, DATE_TIME_FORMAT_ISO) : undefined,
    };
  }
}
