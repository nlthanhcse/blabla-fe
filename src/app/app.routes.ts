import { Routes } from '@angular/router';
import { authGuard } from './shared/guard/auth.guard';
import { roleGuard } from './shared/guard/role.guard';
import { HomeComponent } from './home/home.component';
import { ForbiddenComponent } from './forbidden/forbidden.component'; // Import the new component

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    children: [
      {
        path: 'user',
        component: HomeComponent,
        canActivate: [() => roleGuard('USER')],
        data: { role: 'USER' }
      },
      {
        path: 'admin',
        component: HomeComponent,
        canActivate: [() => roleGuard('ADMIN')],
        data: { role: 'ADMIN' }
      },
      { path: '', redirectTo: 'user', pathMatch: 'full' }
    ]
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent // Add the forbidden route
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
