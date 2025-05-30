import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { IPartner } from '../partner.model';

type EntityArrayResponseType = HttpResponse<IPartner[]>;

@Injectable({ providedIn: 'root' })
export class PartnerService {
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
    return this.http.get<IPartner[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
