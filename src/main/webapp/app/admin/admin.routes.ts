import { Routes } from '@angular/router';

const adminRoutes: Routes = [
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs.component'),
    title: 'global.menu.admin.apidocs',
  },
  // {
  //   path: 'health',
  //   loadComponent: () => import('./health/health.component'),
  //   title: 'health.title',
  // },
  // {
  //   path: 'logs',
  //   loadComponent: () => import('./logs/logs.component'),
  //   title: 'logs.title',
  // },
  {
    path: 'metrics',
    loadComponent: () => import('./metrics/metrics.component'),
  },
  {
    path: 'jobs',
    loadChildren: () => import('./job/job.route'),
  },
];

export default adminRoutes;
