import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagoPaTaxonomyAggregatePositionComponent } from './list/taxonomy-aggregate-position.component';
import { Authority } from 'app/config/authority.constants';

const taxonomyAggregatePositionRoutes: Routes = [
  {
    path: '',
    component: PagoPaTaxonomyAggregatePositionComponent,
    data: {
      authorities: [Authority.PAGOPA_TAXONOMY_AGGREGATE_POSITION_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
];

export default taxonomyAggregatePositionRoutes;
