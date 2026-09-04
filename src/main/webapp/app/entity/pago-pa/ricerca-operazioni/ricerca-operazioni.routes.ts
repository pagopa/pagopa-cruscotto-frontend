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
];

export default ricercaOperazioniRoutes;
