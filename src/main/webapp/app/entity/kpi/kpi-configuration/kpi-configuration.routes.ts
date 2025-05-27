import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KpiConfigurationComponent } from './list/kpi-configuration.component';
import { KpiConfigurationRoutingResolve } from './route/kpi-configuration-routing-resolve.service';
import KpiConfigurationDetailComponent from './detail/kpi-configuration-detail.component';

const kpiConfigurationRoutes: Routes = [
  {
    path: '',
    component: KpiConfigurationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':moduleCode/view',
    component: KpiConfigurationDetailComponent,
    resolve: {
      kpiConfiguration: KpiConfigurationRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default kpiConfigurationRoutes;
