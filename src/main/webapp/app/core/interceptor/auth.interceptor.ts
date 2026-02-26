import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { MsalService } from '@azure/msal-angular';

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

    // Check if this is an API request that would be protected by MSAL
    const isMsalProtectedUrl =
      request.url.startsWith('/api/') || request.url.startsWith('/services/') || request.url.startsWith('/management/');

    // If the user is authenticated via MSAL (Entra ID SSO), let MsalInterceptor handle the token
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (activeAccount && isMsalProtectedUrl) {
      return next.handle(request);
    }

    // Fallback: attach legacy JWT token if present
    const token: string | null = this.stateStorageService.getAuthenticationToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}
