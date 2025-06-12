import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagoPaRecordedTimeoutComponent } from './list/recorded-timeout.component';

const recordedTimeoutRoutes: Routes = [
  {
    path: '',
    component: PagoPaRecordedTimeoutComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default recordedTimeoutRoutes;
