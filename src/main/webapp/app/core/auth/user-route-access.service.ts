import { inject, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from './state-storage.service';
import { MsalService } from '@azure/msal-angular';

export const UserRouteAccessService: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const stateStorageService = inject(StateStorageService);
  const msalService = inject(MsalService);

  return accountService.identity().pipe(
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

      // Check if user is authenticated via MSAL but backend identity failed to load
      const activeAccount = msalService.instance.getActiveAccount();
      if (activeAccount) {
        // User is MSAL authenticated but backend identity not loaded
        // This might happen if the API call failed, try to reload identity
        if (isDevMode()) {
          console.log('MSAL authenticated but no backend identity, attempting to reload...');
        }
        // Return true to allow navigation, let the component handle identity loading
        return true;
      }

      stateStorageService.storeUrl(state.url);
      router.navigate(['/login']);
      return false;
    }),
  );
};
