import { Routes } from '@angular/router';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import { Authority } from '../config/authority.constants';

const adminRoutes: Routes = [
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs.component'),
    data: { authorities: [Authority.CONTROL_TOOLS] },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'metrics',
    loadComponent: () => import('./metrics/metrics.component'),
    data: { authorities: [Authority.CONTROL_TOOLS] },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'jobs',
    loadChildren: () => import('./job/job.route'),
  },
];

export default adminRoutes;
