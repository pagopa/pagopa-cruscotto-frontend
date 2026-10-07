import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { throwError } from 'rxjs';

import { ErrorHandlerInterceptor } from './error-handler.interceptor';

describe('ErrorHandlerInterceptor', () => {
  let eventManager: EventManager;
  let interceptor: ErrorHandlerInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerInterceptor, EventManager],
    });

    eventManager = TestBed.inject(EventManager);
    interceptor = TestBed.inject(ErrorHandlerInterceptor);
  });

  it('broadcasts the duplicate instance name alert for a bulk search 509 error', () => {
    const error = createError(509, 'https://example.test/api/bulk/search-instances');
    let receivedEvent: EventWithContent<unknown> | undefined;
    eventManager.subscribe('pagopaCruscottoApp.alert', event => (receivedEvent = event as EventWithContent<unknown>));

    interceptor
      .intercept(new HttpRequest('POST', error.url), {
        handle: jest.fn(() => throwError(() => error)),
      })
      .subscribe({ error: () => undefined });

    expect(receivedEvent).toEqual(
      expect.objectContaining({
        name: 'pagopaCruscottoApp.alert',
        content: {
          type: 'error',
          translationKey: 'error.duplicateInstanceName',
        },
      }),
    );
  });

  it('keeps broadcasting other errors through the HTTP error event', () => {
    const error = createError(509, 'https://example.test/api/other');
    let receivedEvent: EventWithContent<unknown> | undefined;
    eventManager.subscribe('pagopaCruscottoApp.httpError', event => (receivedEvent = event as EventWithContent<unknown>));

    interceptor
      .intercept(new HttpRequest('POST', error.url), {
        handle: jest.fn(() => throwError(() => error)),
      })
      .subscribe({ error: () => undefined });

    expect(receivedEvent?.content).toBe(error);
  });
});

function createError(status: number, url: string): HttpErrorResponse {
  return new HttpErrorResponse({ status, url });
}
