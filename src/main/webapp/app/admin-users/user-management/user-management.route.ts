import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { of } from 'rxjs';

import { IUser } from './user-management.model';
import { UserManagementService } from './service/user-management.service';
import { UserRouteAccessService } from '../../core/auth/user-route-access.service';
import UserManagementComponent from './list/user-management.component';
import UserManagementDetailComponent from './detail/user-management-detail.component';
import UserManagementUpdateComponent from './update/user-management-update.component';
import { Authority } from 'app/config/authority.constants';

export const userManagementResolve: ResolveFn<IUser | null> = (route: ActivatedRouteSnapshot) => {
  const login = route.paramMap.get('login');
  const id = route.paramMap.get('id');
  if (login) {
    return inject(UserManagementService).find(login);
  } else if (id) {
    return inject(UserManagementService).findById(Number(id));
  }
  return of(null);
};

const userManagementRoute: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: {
      authorities: [Authority.USER_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':login/view',
    component: UserManagementDetailComponent,
    data: {
      authorities: [Authority.USER_INQUIRY],
    },
    resolve: {
      user: userManagementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserManagementUpdateComponent,
    data: {
      authorities: [Authority.USER_MANAGEMENT],
    },
    resolve: {
      user: userManagementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserManagementUpdateComponent,
    data: {
      authorities: [Authority.USER_MANAGEMENT],
    },
    resolve: {
      user: userManagementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userManagementRoute;
