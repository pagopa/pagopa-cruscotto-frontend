import { Routes } from '@angular/router';

import { JobComponent } from './job.component';
import { UserRouteAccessService } from '../../core/auth/user-route-access.service';
import { ExecutionComponent } from './execution/execution.component';

const jobsRoutes: Routes = [
  {
    path: '',
    component: JobComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'execution',
    component: ExecutionComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default jobsRoutes;
