import { Routes } from '@angular/router';
import { SampleLayoutComponent } from './layouts/sample.layout';
import { Error404Component } from './layouts/error/404.component';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    component: SampleLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./login/login.routes'),
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.routes'),
        title: 'home.title',
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.routes'),
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes'),
      },
      {
        path: 'admin-users',
        loadChildren: () => import('./admin-users/admin-users.routes'),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      ...errorRoute,
    ],
  },
  {
    path: '404',
    component: Error404Component,
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

export default routes;
