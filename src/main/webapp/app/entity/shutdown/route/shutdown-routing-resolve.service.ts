import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ShutdownService } from '../service/shutdown.service';
import { IShutdown } from '../shutdown.model';

export const ShutdownRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IShutdown> => {
  const id = route.params.id;
  if (id) {
    return inject(ShutdownService)
      .find(id)
      .pipe(
        mergeMap((response: HttpResponse<IShutdown>) => {
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
