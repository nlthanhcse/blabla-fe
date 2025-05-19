import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AppStore} from '../store/app.store';

export const loginGuard: CanActivateFn = (route, state) => {

  const appStore = inject(AppStore);
  const router = inject(Router);

  if (appStore.isAuthenticated()) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
