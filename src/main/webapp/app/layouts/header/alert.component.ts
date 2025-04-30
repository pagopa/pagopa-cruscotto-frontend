import { Component, inject, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { translationNotFoundMessage } from 'app/config/translation.config';
import { Alert, AlertType } from '../../core/util/alert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'jhi-alert-toastr',
  template: ``,
  styleUrls: ['./alert.component.scss'],
})
export default class AlertToastrComponent implements OnDestroy {
  alertListener?: Subscription;
  httpErrorListener?: Subscription;

  private readonly translateService = inject(TranslateService);
  private readonly eventManager = inject(EventManager);
  private readonly toastrService = inject(ToastrService);

  constructor() {
    this.alertListener = this.eventManager.subscribe('pagopaCruscottoApp.alert', (response: EventWithContent<unknown> | string) => {
      const alert = (response as EventWithContent<Alert>).content;
      this.addAlert(alert.type, alert.message, alert.translationKey, alert.translationParams);
    });

    this.httpErrorListener = this.eventManager.subscribe(
      'pagopaCruscottoApp.httpError',
      (response: EventWithContent<unknown> | string) => {
        let i;
        const httpErrorResponse = (response as EventWithContent<HttpErrorResponse>).content;

        switch (httpErrorResponse.status) {
          // connection refused, server not reachable
          case 0:
            this.addAlert('error', 'Server not reachable', 'error.server.not.reachable');
            break;

          case 500: {
            if (httpErrorResponse.error === null || httpErrorResponse.error === undefined) {
              this.addAlert('error', 'error.http.500');
            } else {
              if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
                if (httpErrorResponse.error.message.toLowerCase() === 'read timed out') {
                  this.addAlert('error', 'Server took to long to respond', 'error.readtimeout');
                } else if (httpErrorResponse.error.message.toLowerCase().includes('connect timed out')) {
                  this.addAlert('error', 'Service temporarily offline', 'error.connectiontimeout');
                } else if (httpErrorResponse.error.message.toLowerCase().includes('connection refused')) {
                  this.addAlert('error', httpErrorResponse.error.message);
                } else {
                  this.addAlert('error', 'error.http.500');
                }
              } else {
                this.addAlert('error', httpErrorResponse.error);
              }
            }
            break;
          }

          case 400: {
            const arr = httpErrorResponse.headers.keys();
            let errorHeader = null;
            let entityKey = null;
            let entityKeyToTranslate = translationNotFoundMessage;
            let params: any = null;

            arr.forEach(entry => {
              if (entry.toLowerCase().endsWith('app-error')) {
                errorHeader = httpErrorResponse.headers.get(entry);
              } else if (entry.toLowerCase().endsWith('app-params')) {
                entityKey = httpErrorResponse.headers.get(entry) ?? '';
                entityKeyToTranslate = 'global.menu.entities.'.concat(entityKey);
              } else if (entry.toLowerCase().startsWith('x-hashmap-')) {
                if (params === null) {
                  params = {};
                }
                params[entry.toLowerCase().split('x-hashmap-')[1]] = httpErrorResponse.headers.get(entry);
              }
            });
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (errorHeader) {
              if (_.startsWith(errorHeader, 'error.')) {
                if (params !== null) {
                  this.addAlert('error', errorHeader, errorHeader, params);
                } else {
                  const entityName = this.translateService.instant(entityKeyToTranslate);
                  this.addAlert('error', errorHeader, errorHeader, { entityName });
                }
              } else {
                const message = errorHeader;
                this.addAlert('error', message, 'error.empty', { message });
              }
            } else if (!httpErrorResponse.error) {
              this.addAlert('error', 'Bad request', 'error.http.400');
            } else if (httpErrorResponse.error?.fieldErrors) {
              const fieldErrors = httpErrorResponse.error.fieldErrors;
              for (const fieldError of fieldErrors) {
                if (fieldError.field) {
                  const convertedField: string = fieldError.field.replace(/\[\d*]/g, '[]');
                  const paramKey = 'pagopaCruscottoApp.'.concat(fieldError.objectName).concat('.').concat(convertedField);
                  const paramName = this.translateService.instant(paramKey);

                  if ('translation-not-found['.concat(paramKey).concat(']') !== paramName) {
                    this.addAlert('error', fieldError.message, 'error.'.concat(fieldError.message), { fieldName: paramName });
                  } else {
                    this.addAlert('error', fieldError.message);
                  }
                } else {
                  this.addAlert('error', fieldError.message);
                }
              }
            } else if (httpErrorResponse.error?.violations) {
              const violations = httpErrorResponse.error.violations;
              for (i = 0; i < violations.length; i++) {
                const violation = violations[i];
                const message = violation.message;
                this.addAlert('error', message, 'error.empty', { message });
              }
            } else if (httpErrorResponse.error?.message) {
              this.addAlert('error', httpErrorResponse.error.message, httpErrorResponse.error.message, httpErrorResponse.error.params);
            } else {
              if (httpErrorResponse.error === 'email address not registered') {
                this.addAlert('error', '', 'reset.request.messages.notfound');
              } else {
                this.addAlert('error', httpErrorResponse.error);
              }
            }
            break;
          }

          case 404:
            this.addAlert('error', httpErrorResponse.error.message, httpErrorResponse.error.message, httpErrorResponse.error.params);
            break;

          case 403:
            this.addAlert('error', 'Unauthorized', 'error.http.403');
            break;
          case 503:
            this.addAlert('error', 'Service Unavailable', 'error.http.503');
            break;

          default:
            console.log(httpErrorResponse.error);
            if (httpErrorResponse.error !== null && httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
              this.addAlert('error', httpErrorResponse.error.message);
            } else {
              this.addAlert('error', httpErrorResponse.error);
            }
        }
      },
    );
  }

  ngOnDestroy(): void {
    if (this.alertListener) {
      this.eventManager.destroy(this.alertListener);
    }
    if (this.httpErrorListener) {
      this.eventManager.destroy(this.httpErrorListener);
    }
  }

  private addAlert(type: AlertType, message?: string | object, key?: string, params?: any): void {
    let msg = '';
    let showAlert = true;

    if (key) {
      const translatedMessage = this.translateService.instant(key, params);
      if (translatedMessage !== `${translationNotFoundMessage}[${key}]`) {
        msg = translatedMessage;
      } else if (!message) {
        msg = key;
      }
    } else if (message) {
      if (typeof message === 'string') {
        msg = this.translateService.instant(message);

        if ('translation-not-found['.concat(message).concat(']') === msg) {
          msg = message;
        }
      } else {
        showAlert = false;
      }
    }

    if (showAlert) {
      this.toastrService.show(
        '',
        msg.replace(/(<([^>]+)>)/gi, ''),
        {
          closeButton: true,
          enableHtml: true,
          progressBar: true,
          positionClass: 'toast-top-full-width',
        },
        'toast-'.concat(type),
      );
    }
  }
}
