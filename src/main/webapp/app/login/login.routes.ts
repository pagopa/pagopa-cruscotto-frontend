import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login.component'),
    title: 'login.title',
  },
];

export default routes;
