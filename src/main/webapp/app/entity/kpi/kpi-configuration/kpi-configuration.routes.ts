import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KpiConfigurationComponent } from './list/kpi-configuration.component';
import { KpiConfigurationRoutingResolve } from './route/kpi-configuration-routing-resolve.service';
import KpiConfigurationDetailComponent from './detail/kpi-configuration-detail.component';
import { KpiConfigurationUpdateComponent } from './update/kpi-configuration-update.component';
import { Authority } from 'app/config/authority.constants';

const kpiConfigurationRoutes: Routes = [
  {
    path: '',
    component: KpiConfigurationComponent,
    data: {
      authorities: [Authority.KPI_CONFIGURATION_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':moduleCode/view',
    component: KpiConfigurationDetailComponent,
    data: {
      authorities: [Authority.KPI_CONFIGURATION_INQUIRY],
    },
    resolve: {
      kpiConfiguration: KpiConfigurationRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KpiConfigurationUpdateComponent,
    data: {
      authorities: [Authority.KPI_CONFIGURATION_MANAGEMENT],
    },
    resolve: {
      kpiConfiguration: KpiConfigurationRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':moduleCode/edit',
    component: KpiConfigurationUpdateComponent,
    data: {
      authorities: [Authority.KPI_CONFIGURATION_MANAGEMENT],
    },
    resolve: {
      kpiConfiguration: KpiConfigurationRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default kpiConfigurationRoutes;
