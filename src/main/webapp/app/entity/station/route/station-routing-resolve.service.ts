import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IStation } from '../station.model';
import { StationService } from '../service/station.service';

export const StationRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IStation> => {
  const id = route.params.id;
  if (id) {
    return inject(StationService)
      .find(id)
      .pipe(
        mergeMap((response: HttpResponse<IStation>) => {
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
