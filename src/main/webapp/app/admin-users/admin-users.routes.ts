import { Routes } from '@angular/router';

const adminUsersRoutes: Routes = [
  {
    path: 'permissions',
    loadChildren: () => import('./permission/permission.routes'),
  },
  {
    path: 'functions',
    loadChildren: () => import('./function/function.routes'),
  },
  {
    path: 'groups',
    loadChildren: () => import('./group/group.routes'),
  },
  {
    path: 'user-management',
    loadChildren: () => import('./user-management/user-management.route'),
    title: 'userManagement.home.title',
  },
];

export default adminUsersRoutes;
