import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StationComponent } from './list/station.component';
import StationDetailComponent from './detail/station-detail.component';
import { StationRoutingResolve } from './route/station-routing-resolve.service';
import { Authority } from 'app/config/authority.constants';

const stationRoutes: Routes = [
  {
    path: '',
    component: StationComponent,
    data: {
      authorities: [Authority.STATION_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StationDetailComponent,
    data: {
      authorities: [Authority.STATION_INQUIRY],
    },
    resolve: {
      station: StationRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default stationRoutes;
