import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagoPaTaxonomyAggregatePositionComponent } from './list/pagoPaTaxonomyAggregatePosition.component';

const pagoPaTaxonomyAggregatePositionRoutes: Routes = [
  {
    path: '',
    component: PagoPaTaxonomyAggregatePositionComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default pagoPaTaxonomyAggregatePositionRoutes;
