import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InstanceComponent } from './list/instance.component';

const instanceRoutes: Routes = [
  {
    path: '',
    component: InstanceComponent,
    canActivate: [UserRouteAccessService],
  },
  // {
  //   path: ':id/view',
  //   component: PermissionDetailComponent,
  //   resolve: {
  //     permission: PermissionRoutingResolve,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  // {
  //   path: 'new',
  //   component: PermissionUpdateComponent,
  //   resolve: {
  //     permission: PermissionRoutingResolve,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  // {
  //   path: ':id/edit',
  //   component: PermissionUpdateComponent,
  //   resolve: {
  //     permission: PermissionRoutingResolve,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
];

export default instanceRoutes;
