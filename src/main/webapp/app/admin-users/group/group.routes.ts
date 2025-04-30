import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GroupComponent } from './list/group.component';
import { GroupDetailComponent } from './detail/group-detail.component';
import { GroupMoreDetailsRoutingResolve, GroupRoutingResolve } from './route/group-routing-resolve.service';
import { GroupUpdateComponent } from './update/group-update.component';
import { GroupManageFunctionsComponent } from './manage-functions/group.manage-functions.component';
import { GroupVisibilityManagementComponent } from './visibility-management/group.visibility-management.component';

const groupRoutes: Routes = [
  {
    path: '',
    component: GroupComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GroupDetailComponent,
    resolve: {
      authGroup: GroupMoreDetailsRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GroupUpdateComponent,
    resolve: {
      authGroup: GroupRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GroupUpdateComponent,
    resolve: {
      authGroup: GroupRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/manage-functions',
    component: GroupManageFunctionsComponent,
    resolve: {
      authGroup: GroupRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'visibility-management',
    component: GroupVisibilityManagementComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default groupRoutes;
