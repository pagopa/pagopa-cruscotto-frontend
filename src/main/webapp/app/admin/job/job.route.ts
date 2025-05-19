import { Routes } from '@angular/router';

import { JobComponent } from './job.component';
import { UserRouteAccessService } from '../../core/auth/user-route-access.service';

const jobsRoutes: Routes = [
  {
    path: '',
    component: JobComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default jobsRoutes;
