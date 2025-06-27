import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FunctionComponent } from './list/function.component';
import { FunctionMoreDetailsRoutingResolve, FunctionRoutingResolve } from './route/function-routing-resolve.service';
import { FunctionDetailComponent } from './detail/function-detail.component';
import { FunctionUpdateComponent } from './update/function-update.component';
import { FunctionManagePermissionsComponent } from './manage-permissions/function.manage-permissions.component';
import { Authority } from 'app/config/authority.constants';

const functionRoutes: Routes = [
  {
    path: '',
    component: FunctionComponent,
    data: {
      authorities: [Authority.FUNCTION_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FunctionDetailComponent,
    data: {
      authorities: [Authority.FUNCTION_INQUIRY],
    },
    resolve: {
      authFunction: FunctionMoreDetailsRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FunctionUpdateComponent,
    data: {
      authorities: [Authority.FUNCTION_MANAGEMENT],
    },
    resolve: {
      authFunction: FunctionRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FunctionUpdateComponent,
    data: {
      authorities: [Authority.FUNCTION_MANAGEMENT],
    },
    resolve: {
      authFunction: FunctionRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/manage-permissions',
    component: FunctionManagePermissionsComponent,
    data: {
      authorities: [Authority.FUNCTION_MANAGEMENT],
    },
    resolve: {
      authFunction: FunctionRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default functionRoutes;
