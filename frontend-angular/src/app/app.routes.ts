import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'users', 
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
  },
  { 
    path: 'users/new', 
    loadComponent: () => import('./components/users/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  { 
    path: 'users/edit/:id', 
    loadComponent: () => import('./components/users/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  { path: '**', redirectTo: '/home' }
];
