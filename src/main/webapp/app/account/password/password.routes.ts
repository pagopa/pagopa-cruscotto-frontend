import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import PasswordComponent from './password.component';
import { Authority } from '../../config/authority.constants';

const passwordRoutes: Route = {
  path: 'password',
  component: PasswordComponent,
  data: {
    authorities: [Authority.FUNZIONI_BASE],
  },
  title: 'global.menu.account.password',
  canActivate: [UserRouteAccessService],
};

export default passwordRoutes;
