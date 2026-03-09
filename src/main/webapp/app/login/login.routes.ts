import { Routes } from '@angular/router';

/**
 * The /login route now redirects to MSAL SSO.
 * A lightweight component triggers loginRedirect so that any direct navigation
 * to /login (bookmarks, deep links) still works.
 */
const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login-redirect.component'),
    title: 'login.title',
  },
];

export default routes;
