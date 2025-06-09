import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PermissionComponent } from './list/permission.component';
import { PermissionDetailComponent } from './detail/permission-detail.component';
import { PermissionUpdateComponent } from './update/permission-update.component';
import { PermissionRoutingResolve } from './route/permission-routing-resolve.service';
import { Authority } from 'app/config/authority.constants';

const permissionRoutes: Routes = [
  {
    path: '',
    component: PermissionComponent,
    data: {
      authorities: [Authority.PERMISSION_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PermissionDetailComponent,
    data: {
      authorities: [Authority.PERMISSION_INQUIRY],
    },
    resolve: {
      permission: PermissionRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PermissionUpdateComponent,
    data: {
      authorities: [Authority.PERMISSION_MANAGEMENT],
    },
    resolve: {
      permission: PermissionRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PermissionUpdateComponent,
    data: {
      authorities: [Authority.PERMISSION_MANAGEMENT],
    },
    resolve: {
      permission: PermissionRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default permissionRoutes;
