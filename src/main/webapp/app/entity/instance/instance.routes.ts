import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InstanceComponent } from './list/instance.component';
import { InstanceUpdateComponent } from './update/instance-update.component';
import { InstanceRoutingResolve } from './route/instance-routing-resolve.service';
import { InstanceDetailComponent } from './detail/instance-detail.component';

const instanceRoutes: Routes = [
  {
    path: '',
    component: InstanceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InstanceDetailComponent,
    resolve: {
      permission: InstanceRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InstanceUpdateComponent,
    resolve: {
      instance: InstanceRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InstanceUpdateComponent,
    resolve: {
      instance: InstanceRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default instanceRoutes;
