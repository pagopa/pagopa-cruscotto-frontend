import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PermissionService } from '../service/permission.service';
import { IPermission } from '../permission.model';

export const PermissionRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IPermission> => {
  const id = route.params.id;
  if (id) {
    return inject(PermissionService)
      .find(id)
      .pipe(
        mergeMap((permission: HttpResponse<IPermission>) => {
          if (permission.body) {
            return of(permission.body);
          }
          void inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};
