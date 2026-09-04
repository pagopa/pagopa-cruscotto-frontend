import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const ricercaMassivaRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ricerca-massiva.component').then(m => m.RicercaMassivaComponent),
    data: {
      // authorities: [Authority.RICERCA_MASSIVA_INQUIRY], TODO
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./create/ricerca-massiva-create.component').then(m => m.RicercaMassivaCreateComponent),
    data: {
      // authorities: [Authority.RICERCA_MASSIVA_INQUIRY], TODO
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ricercaMassivaRoutes;
