import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TaxonomyComponent } from './list/taxonomy.component';
import TaxonomyDetailComponent from './detail/taxonomy-detail.component';
import { TaxonomyRoutingResolve } from './route/taxonomy-routing-resolve.service';

const taxonomyRoutes: Routes = [
  {
    path: '',
    component: TaxonomyComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TaxonomyDetailComponent,
    resolve: {
      taxonomy: TaxonomyRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default taxonomyRoutes;
