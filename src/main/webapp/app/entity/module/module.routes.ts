import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ModuleComponent } from './list/module.component';
import ModuleDetailComponent from './detail/module-detail.component';
import { ModuleRoutingResolve } from './route/module-routing-resolve.service';
import { ModuleUpdateComponent } from './update/module-update.component';

const moduleRoutes: Routes = [
  {
    path: '',
    component: ModuleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ModuleDetailComponent,
    resolve: {
      module: ModuleRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ModuleUpdateComponent,
    resolve: {
      module: ModuleRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ModuleUpdateComponent,
    resolve: {
      module: ModuleRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default moduleRoutes;
