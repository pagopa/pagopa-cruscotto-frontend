import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { SearchInstanceDTO } from '../models/bulk-search.model';
import { BulkSearchService } from '../services/bulk-search.service';
import { getRicercaMassivaDetailMock } from './ricerca-massiva.mock';

export const ricercaMassivaDetailResolver: ResolveFn<SearchInstanceDTO> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  const bulkSearchService = inject(BulkSearchService);
  const spinner = inject(NgxSpinnerService);

  if (!id) {
    return of({});
  }

  void spinner.show('bulkDetailResolve');
  return bulkSearchService.get(id).pipe(
    catchError(() => of(getRicercaMassivaDetailMock(id))),
    finalize(() => void spinner.hide('bulkDetailResolve')),
  );
};
