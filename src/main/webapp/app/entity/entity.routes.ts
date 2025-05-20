import { Routes } from '@angular/router';

const entityRoutes: Routes = [
  {
    path: 'instances',
    loadChildren: () => import('./instance/route/instance.routes'),
  },
  {
    path: 'shutdowns',
    loadChildren: () => import('./shutdown/shutdown.routes'),
  },
];

export default entityRoutes;
