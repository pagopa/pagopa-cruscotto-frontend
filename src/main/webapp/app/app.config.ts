import { ApplicationConfig, LOCALE_ID, importProvidersFrom, inject } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import {
  RouterFeatures,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withNavigationErrorHandler,
  NavigationError,
  Router,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import './config/dayjs';
import { TranslationModule } from 'app/shared/language/translation.module';
import { environment } from 'environments/environment';
import { httpInterceptorProviders } from './core/interceptor';
import routes from './app.routes';

import { AppPageTitleStrategy } from './app-page-title-strategy';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { NgcCookieConsentConfig, provideNgcCookieConsent } from 'ngx-cookieconsent';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DayjsDateAdapter, MAT_DAYJS_DATE_ADAPTER_OPTIONS } from './shared/adapter/dayjs-date.adapter';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorI18nService } from './shared/pagination/mat-paginator-i18n.service';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideNgxMask } from 'ngx-mask';

const MAT_DAYJS_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['DD/MM/YYYY'],
    timeInput: 'HH:mm',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    timeInput: 'HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
    timeOptionLabel: 'HH:mm',
  },
};

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'localhost',
  },
  position: 'bottom',
  theme: 'edgeless',
  palette: {
    popup: {
      background: '#000000',
      text: '#ffffff',
      link: '#ffffff',
    },
    button: {
      background: '#2100f1',
      text: '#ffffff',
      border: 'transparent',
    },
  },
  type: 'info',
  content: {
    message: 'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: 'Got it!',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: '/cookie',
    policy: 'Cookie Policy',
  },
  layout: 'my-custom-layout',
  layouts: {
    'my-custom-layout': '{{messagelink}}{{compliance}}',
  },
  elements: {
    messagelink: `
        <span id="cookieconsent:desc" class="cc-message">{{message}}
          <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{ href }}" target="_self">{{policy}}</a>
        </span>
        `,
  },
};

const routerFeatures: RouterFeatures[] = [
  withComponentInputBinding(),
  withNavigationErrorHandler((e: NavigationError) => {
    const router = inject(Router);
    console.log('--------------');
    console.log(router);
    console.log('--------------');
    if (e.error.status === 403) {
      void router.navigate(['/accessdenied']);
    } else if (e.error.status === 404) {
      void router.navigate(['/404']);
    } else if (e.error.status === 401) {
      void router.navigate(['/login']);
    } else {
      void router.navigate(['/error']);
    }
  }),
];
if (environment.DEBUG_INFO_ENABLED) {
  routerFeatures.push(withDebugTracing());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, ...routerFeatures),
    importProvidersFrom(BrowserModule),
    // Set this to true to enable service worker (PWA)
    importProvidersFrom(ServiceWorkerModule.register('ngsw-worker.js', { enabled: false })),
    importProvidersFrom(TranslationModule),
    importProvidersFrom(ToastrModule.forRoot()),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideNgxMask(),
    Title,
    { provide: LOCALE_ID, useValue: 'it' },
    httpInterceptorProviders,
    { provide: TitleStrategy, useClass: AppPageTitleStrategy },
    { provide: MAT_DAYJS_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_DAYJS_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorI18nService,
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DAYJS_DATE_FORMATS },
    MatIconRegistry,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
};
