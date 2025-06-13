import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagoPaRecordedTimeoutComponent } from './list/recorded-timeout.component';
import { Authority } from 'app/config/authority.constants';

const recordedTimeoutRoutes: Routes = [
  {
    path: '',
    component: PagoPaRecordedTimeoutComponent,
    data: {
      authorities: [Authority.PAGOPA_RECORDED_TIMEOUT_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
];

export default recordedTimeoutRoutes;
