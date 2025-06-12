import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagoPaTaxonomyAggregatePositionComponent } from './list/taxonomy-aggregate-position.component';

const taxonomyAggregatePositionRoutes: Routes = [
  {
    path: '',
    component: PagoPaTaxonomyAggregatePositionComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default taxonomyAggregatePositionRoutes;
