import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { KpiConfigurationService } from '../service/kpi-configuration.service';
import { IKpiConfiguration } from '../kpi-configuration.model';

export const KpiConfigurationRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | IKpiConfiguration> => {
  const moduleCode = route.params.moduleCode;
  if (moduleCode) {
    return inject(KpiConfigurationService)
      .find(moduleCode)
      .pipe(
        mergeMap((response: HttpResponse<IKpiConfiguration>) => {
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
