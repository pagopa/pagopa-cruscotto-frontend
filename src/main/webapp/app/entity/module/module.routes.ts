import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ModuleComponent } from './list/module.component';

const moduleRoutes: Routes = [
  {
    path: '',
    component: ModuleComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default moduleRoutes;
