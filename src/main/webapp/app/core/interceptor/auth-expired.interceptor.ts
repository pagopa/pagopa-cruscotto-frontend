import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { Authority } from '../../config/authority.constants';
import { AccountService } from '../auth/account.service';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
  private readonly loginService = inject(LoginService);
  private readonly accountService = inject(AccountService);
  private readonly stateStorageService = inject(StateStorageService);
  private readonly router = inject(Router);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const hasAuthorityChangePasswordExpired = this.accountService.hasAnyAuthority(Authority.CHANGE_PASSWORD_EXPIRED);
            if (hasAuthorityChangePasswordExpired) {
              // così funziona ma poi il token non ha l'authority e torna 403
              // se si manada alla login poi fa un loop quando la password scaduta ce l'ha nella login perchè cmq passa da qua
              // creare interceptor che se token in storage != token itonato fa rifare getaccount
              void this.router.navigate(['/account/password-expired']);
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          if (
            err.status === 401 &&
            err.url &&
            !err.url.includes('api/account') &&
            !err.url.includes('api/authenticate') &&
            this.accountService.isAuthenticated()
          ) {
            this.stateStorageService.storeUrl(this.router.routerState.snapshot.url);
            this.loginService.logout();
            void this.router.navigate(['']);
          }
        },
      }),
    );
  }
}
