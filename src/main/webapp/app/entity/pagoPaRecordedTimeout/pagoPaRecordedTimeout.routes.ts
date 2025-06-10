import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagoPaRecordedTimeoutComponent } from './list/pagoPaRecordedTimeout.component';

const pagoPaRecordedTimeoutRoutes: Routes = [
  {
    path: '',
    component: PagoPaRecordedTimeoutComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default pagoPaRecordedTimeoutRoutes;
