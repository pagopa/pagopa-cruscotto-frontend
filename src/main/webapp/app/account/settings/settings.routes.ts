import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Authority } from '../../config/authority.constants';
import SettingsComponent from './settings.component';

const settingsRoutes: Route = {
  path: 'settings',
  component: SettingsComponent,
  data: {
    authorities: [Authority.BASIC_FUNCTIONS],
  },
  title: 'global.menu.account.settings',
  canActivate: [UserRouteAccessService],
};

export default settingsRoutes;
