import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { Alert } from '../util/alert.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  private readonly eventManager = inject(EventManager);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          //avoid broadcasting error when generating report, as it is expected to receive a 409 response with the message "Report generation in progress" if the report is already being generated
          if (!(err.status === 409 && err.url?.includes('generate-async'))) {
            if (!(err.status === 401 && (err.message === '' || err.url?.includes('api/account')))) {
              if (!err.url?.includes('reset_password/finish')) {
                if (err.error instanceof Blob) {
                  let alert: Alert = { type: 'error', translationKey: 'error.download' };
                  if (err.status === 404) {
                    alert = { type: 'error', translationKey: 'error.download.404' };
                  }
                  this.eventManager.broadcast(new EventWithContent('pagopaCruscottoApp.alert', alert));
                } else {
                  this.eventManager.broadcast(new EventWithContent('pagopaCruscottoApp.httpError', err));
                }
              }
            }
          }
        },
      }),
    );
  }
}
