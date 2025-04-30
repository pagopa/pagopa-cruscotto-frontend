import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IFunction } from '../function.model';
import { FunctionService } from '../service/function.service';

export const FunctionMoreDetailsRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IFunction> => {
  const id = route.params.id;
  if (id) {
    return inject(FunctionService)
      .findDetail(id)
      .pipe(
        mergeMap((authFunction: HttpResponse<IFunction>) => {
          if (authFunction.body) {
            return of(authFunction.body);
          }
          void inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export const FunctionRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IFunction> => {
  const id = route.params.id;
  if (id) {
    return inject(FunctionService)
      .find(id)
      .pipe(
        mergeMap((authFunction: HttpResponse<IFunction>) => {
          if (authFunction.body) {
            return of(authFunction.body);
          }
          void inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};
