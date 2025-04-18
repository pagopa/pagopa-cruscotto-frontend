import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { GroupService } from '../service/group.service';
import { IGroup } from '../group.model';

export const GroupMoreDetailsRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IGroup> => {
  const id = route.params.id;
  if (id) {
    return inject(GroupService)
      .findDetail(id)
      .pipe(
        mergeMap((authGroup: HttpResponse<IGroup>) => {
          if (authGroup.body) {
            return of(authGroup.body);
          }
          void inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export const GroupRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IGroup> => {
  const id = route.params.id;
  if (id) {
    return inject(GroupService)
      .find(id)
      .pipe(
        mergeMap((authGroup: HttpResponse<IGroup>) => {
          if (authGroup.body) {
            return of(authGroup.body);
          }
          void inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};
