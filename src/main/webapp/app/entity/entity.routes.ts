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
    path: 'pagoPaPaymentReceipt',
    loadChildren: () => import('./pagoPaPaymentReceipt/pagoPaPaymentReceipt.routes'),
  },
  {
    path: 'pagoPaRecordedTimeout',
    loadChildren: () => import('./pagoPaRecordedTimeout/pagoPaRecordedTimeout.routes'),
  },
  {
    path: 'pagoPaTaxonomyAggregatePosition',
    loadChildren: () => import('./pagoPaTaxonomyAggregatePosition/pagoPaTaxonomyAggregatePosition.routes'),
  },
];

export default entityRoutes;
