import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShutdownComponent } from './list/shutdown.component';
import ShutdownDetailComponent from './detail/shutdown-detail.component';

import { ShutdownRoutingResolve } from './route/shutdown-routing-resolve.service';
import { ShutdownUpdateComponent } from './update/shutdown-update.component';
import { Authority } from 'app/config/authority.constants';

const instanceRoutes: Routes = [
  {
    path: '',
    component: ShutdownComponent,
    data: {
      authorities: [Authority.SHUTDOWN_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShutdownDetailComponent,
    data: {
      authorities: [Authority.SHUTDOWN_INQUIRY],
    },
    resolve: {
      shutdown: ShutdownRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShutdownUpdateComponent,
    data: {
      authorities: [Authority.SHUTDOWN_MANAGEMENT],
    },
    resolve: {
      shutdown: ShutdownRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShutdownUpdateComponent,
    data: {
      authorities: [Authority.SHUTDOWN_MANAGEMENT],
    },
    resolve: {
      shutdown: ShutdownRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default instanceRoutes;
