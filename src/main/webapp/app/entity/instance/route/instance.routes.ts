import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InstanceComponent } from '../list/instance.component';
import { InstanceUpdateComponent } from '../update/instance-update.component';
import { InstanceRoutingResolve } from './instance-routing-resolve.service';
import { InstanceDetailComponent } from '../detail/instance-detail.component';
import { Authority } from 'app/config/authority.constants';

const instanceRoutes: Routes = [
  {
    path: '',
    component: InstanceComponent,
    data: {
      authorities: [Authority.INSTANCE_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InstanceDetailComponent,
    data: {
      authorities: [Authority.INSTANCE_INQUIRY],
    },
    resolve: {
      instance: InstanceRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InstanceUpdateComponent,
    data: {
      authorities: [Authority.INSTANCE_MANAGEMENT],
    },
    resolve: {
      instance: InstanceRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InstanceUpdateComponent,
    data: {
      authorities: [Authority.INSTANCE_MANAGEMENT],
    },
    resolve: {
      instance: InstanceRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default instanceRoutes;
