import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Authority } from 'app/config/authority.constants';

const ricercaOperazioniRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ricerca-operazioni.component').then(m => m.RicercaOperazioniComponent),
    data: {
      // authorities: [Authority.RICERCA_OPERAZIONI_INQUIRY], TODO
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':positionId/view',
    loadComponent: () => import('./detail/ricerca-operazioni-detail.component').then(m => m.RicercaOperazioniDetailComponent),
    data: {
      // authorities: [Authority.RICERCA_OPERAZIONI_INQUIRY],
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ricercaOperazioniRoutes;
