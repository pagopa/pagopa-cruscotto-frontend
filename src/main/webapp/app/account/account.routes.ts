import { Routes } from '@angular/router';

import passwordRoutes from './password/password.routes';
import passwordExpiredRoutes from './password/password-expired.routes';
import passwordResetFinishRoute from './password-reset/finish/password-reset-finish.route';
import passwordResetInitRoute from './password-reset/init/password-reset-init.route';
import settingsRoutes from './settings/settings.routes';

const accountRoutes: Routes = [passwordRoutes, passwordExpiredRoutes, passwordResetFinishRoute, passwordResetInitRoute, settingsRoutes];

export default accountRoutes;
