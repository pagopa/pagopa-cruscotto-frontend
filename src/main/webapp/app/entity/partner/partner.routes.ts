import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PartnerComponent } from './list/partner.component';
import PartnerDetailComponent from './detail/partner-detail.component';
import { PartnerRoutingResolve } from './route/partner-routing-resolve.service';

const partnerRoutes: Routes = [
  {
    path: '',
    component: PartnerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartnerDetailComponent,
    resolve: {
      partner: PartnerRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default partnerRoutes;
