import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShutdownComponent } from './list/shutdown.component';
import ShutdownDetailComponent from './detail/shutdown-detail.component';

import { ShutdownRoutingResolve } from './route/shutdown-routing-resolve.service';
import { ShutdownUpdateComponent } from './update/shutdown-update.component';

const instanceRoutes: Routes = [
  {
    path: '',
    component: ShutdownComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShutdownDetailComponent,
    resolve: {
      shutdown: ShutdownRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShutdownUpdateComponent,
    resolve: {
      shutdown: ShutdownRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShutdownUpdateComponent,
    resolve: {
      shutdown: ShutdownRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default instanceRoutes;
