import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Authority } from '../../config/authority.constants';
import PasswordExpiredComponent from './password-expired.component';

const passwordExpiredRoutes: Route = {
  path: 'password-expired',
  component: PasswordExpiredComponent,
  data: {
    authorities: [Authority.CHANGE_PASSWORD_EXPIRED],
  },
  title: 'global.menu.account.passwordExpired',
  canActivate: [UserRouteAccessService],
};

export default passwordExpiredRoutes;
