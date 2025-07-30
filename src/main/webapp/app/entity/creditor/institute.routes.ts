import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Authority } from 'app/config/authority.constants';
import { InstituteComponent } from './list/institute.component';

const partnerRoutes: Routes = [
  {
    path: '',
    component: InstituteComponent,
    data: {
      authorities: [Authority.PARTNER_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
];

export default partnerRoutes;
