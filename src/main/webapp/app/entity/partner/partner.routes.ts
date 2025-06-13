import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PartnerComponent } from './list/partner.component';
import PartnerDetailComponent from './detail/partner-detail.component';
import { PartnerRoutingResolve } from './route/partner-routing-resolve.service';
import { Authority } from 'app/config/authority.constants';

const partnerRoutes: Routes = [
  {
    path: '',
    component: PartnerComponent,
    data: {
      authorities: [Authority.PARTNER_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartnerDetailComponent,
    data: {
      authorities: [Authority.PARTNER_INQUIRY],
    },
    resolve: {
      partner: PartnerRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default partnerRoutes;
