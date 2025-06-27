import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { InstanceService } from '../service/instance.service';
import { IInstance } from '../models/instance.model';

export const InstanceRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IInstance> => {
  const id = route.params.id;
  if (id) {
    return inject(InstanceService)
      .find(id)
      .pipe(
        mergeMap((instance: HttpResponse<IInstance>) => {
          if (instance.body) {
            return of(instance.body);
          }
          void inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};
