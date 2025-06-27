import { Routes } from '@angular/router';

import { JobComponent } from './job.component';
import { UserRouteAccessService } from '../../core/auth/user-route-access.service';
import { ExecutionComponent } from './execution/execution.component';
import { Authority } from '../../config/authority.constants';

const jobsRoutes: Routes = [
  {
    path: '',
    component: JobComponent,
    data: {
      authorities: [Authority.JOB_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'execution',
    data: {
      authorities: [Authority.JOB_INQUIRY],
    },
    component: ExecutionComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default jobsRoutes;
