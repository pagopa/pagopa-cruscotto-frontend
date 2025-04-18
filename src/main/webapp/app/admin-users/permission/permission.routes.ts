import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PermissionComponent } from './list/permission.component';
import { PermissionDetailComponent } from './detail/permission-detail.component';
import { PermissionUpdateComponent } from './update/permission-update.component';
import { PermissionRoutingResolve } from './route/permission-routing-resolve.service';

const permissionRoutes: Routes = [
  {
    path: '',
    component: PermissionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PermissionDetailComponent,
    resolve: {
      permission: PermissionRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PermissionUpdateComponent,
    resolve: {
      permission: PermissionRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PermissionUpdateComponent,
    resolve: {
      permission: PermissionRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default permissionRoutes;
