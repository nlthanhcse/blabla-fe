import {Routes} from '@angular/router';
import {authGuard} from './shared/guard/auth.guard';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {loginGuard} from './shared/guard/login.guard';

export const routes: Routes = [
  {pathMatch: 'full', path: '', redirectTo: 'login'},
  {path: 'login', title: 'Login', component: LoginComponent, canActivate: [loginGuard]},
  {
    path: 'home',
    title: 'Home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
];
