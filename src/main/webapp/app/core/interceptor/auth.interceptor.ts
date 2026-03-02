import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, switchMap, catchError, of } from 'rxjs';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly stateStorageService = inject(StateStorageService);
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly msalService = inject(MsalService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const serverApiUrl = this.applicationConfigService.getEndpointFor('');

    if (
      !request.url ||
      (request.url.startsWith('http') && !(serverApiUrl && request.url.startsWith(serverApiUrl))) ||
      request.url.includes('management/info') ||
      request.url.includes('api/authenticate')
    ) {
      return next.handle(request);
    }

    // If user is authenticated via MSAL, try to get a fresh/valid token (handles auto-refresh)
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (activeAccount) {
      return from(
        this.msalService.instance.acquireTokenSilent({
          scopes: environment.msalConfig.apiScopes,
          account: activeAccount,
        }),
      ).pipe(
        switchMap(response => {
          // Store the (possibly refreshed) token
          this.stateStorageService.storeAuthenticationToken(response.accessToken, false);
          return next.handle(this.addToken(request, response.accessToken));
        }),
        catchError(() => {
          // acquireTokenSilent may fail during redirect processing — fall back to stored token
          const storedToken = this.stateStorageService.getAuthenticationToken();
          return next.handle(storedToken ? this.addToken(request, storedToken) : request);
        }),
      );
    }

    // Fallback: attach stored token (legacy JWT or previously stored MSAL token)
    const token = this.stateStorageService.getAuthenticationToken();
    return next.handle(token ? this.addToken(request, token) : request);
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
}
