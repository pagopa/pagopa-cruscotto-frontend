import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TaxonomyService } from '../service/taxonomy.service';
import { ITaxonomy } from '../taxonomy.model';

export const TaxonomyRoutingResolve = (route: ActivatedRouteSnapshot): Observable<null | ITaxonomy> => {
  const id = route.params.id;
  if (id) {
    return inject(TaxonomyService)
      .find(id)
      .pipe(
        mergeMap((response: HttpResponse<ITaxonomy>) => {
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
