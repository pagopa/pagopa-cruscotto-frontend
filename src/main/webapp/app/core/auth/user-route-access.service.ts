import { inject, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from './state-storage.service';
import { LoginService } from 'app/login/login.service';

export const UserRouteAccessService: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const stateStorageService = inject(StateStorageService);
  const loginService = inject(LoginService);

  // getAuthenticationState() replays the last value emitted by AppComponent after MSAL finishes.
  // If auth is not yet determined, this waits (no polling, no HTTP call from the guard).
  return accountService.getAuthenticationState().pipe(
    take(1),
    map(account => {
      if (account) {
        const { authorities } = next.data;

        if (!authorities || authorities.length === 0 || accountService.hasAnyAuthority(authorities)) {
          return true;
        }

        if (isDevMode()) {
          console.error('User does not have any of the required authorities:', authorities);
        }
        router.navigate(['accessdenied']);
        return false;
      }

      // Store the requested URL so we can redirect after login completes
      stateStorageService.storeUrl(state.url);
      // Trigger MSAL login directly — no login page
      loginService.loginWithSSO();
      return false;
    }),
  );
};
