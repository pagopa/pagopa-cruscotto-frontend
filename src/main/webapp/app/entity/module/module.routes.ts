import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ModuleComponent } from './list/module.component';
import ModuleDetailComponent from './detail/module-detail.component';
import { ModuleRoutingResolve } from './route/module-routing-resolve.service';
import { ModuleUpdateComponent } from './update/module-update.component';
import { Authority } from 'app/config/authority.constants';

const moduleRoutes: Routes = [
  {
    path: '',
    component: ModuleComponent,
    data: {
      authorities: [Authority.MODULE_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ModuleDetailComponent,
    data: {
      authorities: [Authority.MODULE_INQUIRY],
    },
    resolve: {
      module: ModuleRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ModuleUpdateComponent,
    data: {
      authorities: [Authority.MODULE_MANAGEMENT],
    },
    resolve: {
      module: ModuleRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ModuleUpdateComponent,
    data: {
      authorities: [Authority.MODULE_MANAGEMENT],
    },
    resolve: {
      module: ModuleRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default moduleRoutes;
