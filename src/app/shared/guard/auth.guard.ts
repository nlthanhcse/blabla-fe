import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {AppStore} from '../store/app.store';

export const authGuard: CanActivateFn = () => {

  const appStore = inject(AppStore);
  const router = inject(Router);

  console.log(appStore.isAuthenticated())
  if (appStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
