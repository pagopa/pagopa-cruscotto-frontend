import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IPartner } from '../partner.model';
import { PartnerService } from '../service/partner.service';

export const PartnerRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IPartner> => {
  const id = route.params.id;
  if (id) {
    return inject(PartnerService)
      .find(id)
      .pipe(
        mergeMap((response: HttpResponse<IPartner>) => {
          if (response.body) {
            return of(response.body);
          }
          void inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};
