import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ModuleService } from '../service/module.service';
import { IModule } from '../module.model';

export const ModuleRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IModule> => {
  const id = route.params.id;
  if (id) {
    return inject(ModuleService)
      .find(id)
      .pipe(
        mergeMap((response: HttpResponse<IModule>) => {
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
