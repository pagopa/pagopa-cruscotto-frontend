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
  {
    path: 'modules',
    loadChildren: () => import('./module/module.routes'),
  },
  {
    path: 'partners',
    loadChildren: () => import('./partner/partner.routes'),
  },
  {
    path: 'stations',
    loadChildren: () => import('./station/station.routes'),
  },
  {
    path: 'institutions',
    loadChildren: () => import('./institute/institute.routes'),
  },
  {
    path: 'payment-receipt',
    loadChildren: () => import('./pago-pa/payment-receipt/payment-receipt.routes'),
  },
  {
    path: 'recorded-timeout',
    loadChildren: () => import('./pago-pa/recorded-timeout/recorded-timeout.routes'),
  },
  {
    path: 'taxonomy-aggregate-position',
    loadChildren: () => import('./pago-pa/taxonomy-aggregate-position/taxonomy-aggregate-position.routes'),
  },
  {
    path: 'ricerca-operazioni',
    loadChildren: () => import('./pago-pa/ricerca-operazioni/ricerca-operazioni.routes'),
  },
  {
    path: 'reporting-flow',
    loadChildren: () => import('./reporting-flow/reporting-flow.routes'),
  },
];

export default entityRoutes;
