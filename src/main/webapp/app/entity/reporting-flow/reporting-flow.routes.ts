import { Routes } from '@angular/router';

// TODO authorities
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StationRoutingResolve } from '../station/route/station-routing-resolve.service';
import { RicercaFlussiRendicontazioneComponent } from './ricerca-flussi-rendicontazione-component/ricerca-flussi-rendicontazione.component';
import { RicercaFlussiRendicontazioneDetailComponent } from './ricerca-flussi-rendicontazione-detail/ricerca-flussi-rendicontazione-detail.component';

const reportingFlowRoutes: Routes = [
  {
    path: '',
    component: RicercaFlussiRendicontazioneComponent,
    //    data: {
    //      authorities: [Authority.STATION_INQUIRY],
    //    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id',
    component: RicercaFlussiRendicontazioneDetailComponent,
    // data: {
    //     authorities: [Authority.STATION_INQUIRY],
    // },
    resolve: {
      station: StationRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reportingFlowRoutes;
