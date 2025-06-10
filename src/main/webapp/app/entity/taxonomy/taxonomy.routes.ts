import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TaxonomyComponent } from './list/taxonomy.component';
import TaxonomyDetailComponent from './detail/taxonomy-detail.component';
import { TaxonomyRoutingResolve } from './route/taxonomy-routing-resolve.service';
import { Authority } from 'app/config/authority.constants';

const taxonomyRoutes: Routes = [
  {
    path: '',
    component: TaxonomyComponent,
    data: {
      authorities: [Authority.TAXONOMY_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TaxonomyDetailComponent,
    data: {
      authorities: [Authority.TAXONOMY_INQUIRY],
    },
    resolve: {
      taxonomy: TaxonomyRoutingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default taxonomyRoutes;
