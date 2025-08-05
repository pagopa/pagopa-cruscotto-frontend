import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IInstituteIdentification } from '../../institute.model';

type EntityArrayResponseType = HttpResponse<IInstituteIdentification[]>;

@Injectable({ providedIn: 'root' })
export class InstituteSelectService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/institutions');

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInstituteIdentification[]>(this.resourceUrl, { params: options, observe: 'response' }).pipe(
      map(res =>
        res.clone({
          body: res.body ? (res.body as IInstituteIdentification[]) : null,
        }),
      ),
    );
  }

  private subject = new Subject<{ partnerId: string | null; reset: boolean; change: boolean }>();

  sendId(arg1: string | null, arg2: boolean, arg3: boolean): void {
    this.subject.next({ partnerId: arg1, reset: arg2, change: arg3 });
  }

  getId(): Observable<{ partnerId: string | null; reset: boolean; change: boolean }> {
    return this.subject.asObservable();
  }
}
