import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Authority } from 'app/config/authority.constants';
import { CreditorComponent } from './list/creditor.component';

const partnerRoutes: Routes = [
  {
    path: '',
    component: CreditorComponent,
    data: {
      authorities: [Authority.PARTNER_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
];

export default partnerRoutes;
