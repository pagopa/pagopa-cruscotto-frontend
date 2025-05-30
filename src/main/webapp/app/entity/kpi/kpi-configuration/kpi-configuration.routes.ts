import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KpiConfigurationComponent } from './list/kpi-configuration.component';
import { KpiConfigurationRoutingResolve } from './route/kpi-configuration-routing-resolve.service';
import KpiConfigurationDetailComponent from './detail/kpi-configuration-detail.component';
import { KpiConfigurationUpdateComponent } from './update/kpi-configuration-update.component';

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
  {
    path: 'new',
    component: KpiConfigurationUpdateComponent,
    resolve: {
      kpiConfiguration: KpiConfigurationRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':moduleCode/edit',
    component: KpiConfigurationUpdateComponent,
    resolve: {
      kpiConfiguration: KpiConfigurationRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default kpiConfigurationRoutes;
