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
  {
    path: 'taxonomies',
    loadChildren: () => import('./taxonomy/taxonomy.routes'),
  },
  {
    path: 'kpi-configurations',
    loadChildren: () => import('./kpi/kpi-configuration/kpi-configuration.routes'),
  },
];

export default entityRoutes;
