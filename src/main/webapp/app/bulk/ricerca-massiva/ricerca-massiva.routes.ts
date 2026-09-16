import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ricercaMassivaDetailResolver } from './ricerca-massiva-detail.resolver';

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
    path: ':id/view',
    loadComponent: () => import('./create/ricerca-massiva-create.component').then(m => m.RicercaMassivaCreateComponent),
    resolve: {
      detailInstance: ricercaMassivaDetailResolver,
    },
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
  {
    path: 'csv',
    loadComponent: () => import('./csv-upload/ricerca-massiva-csv-upload.component').then(m => m.RicercaMassivaCsvUploadComponent),
    data: {
      // authorities: [Authority.RICERCA_MASSIVA_INQUIRY], TODO
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ricercaMassivaRoutes;
