import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StationComponent } from '../list/station.component';
import StationDetailComponent from '../detail/station-detail.component';
import { StationRoutingResolve } from './station-routing-resolve.service';

const stationRoutes: Routes = [
  {
    path: '',
    component: StationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StationDetailComponent,
    resolve: {
      station: StationRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default stationRoutes;
