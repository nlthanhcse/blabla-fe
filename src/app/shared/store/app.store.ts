import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {UserModel} from '../model/user.model';
import {KEYS} from '../constant/application.constant';

interface AppState {
  meUser: UserModel | null;
  loggingIn: boolean;
  isAuthenticated: boolean;
}

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>({
    meUser: null,
    loggingIn: false,
    isAuthenticated: !!localStorage.getItem(KEYS.AUTH_TOKEN),
  }),
  withMethods((store) => ({
    startLogin() {
      patchState(store, (state) => ({ ...state, loggingIn: true }));
    },
    stopLogin() {
      patchState(store, (state) => ({ ...state, loggingIn: false }));
    },
    setAsAuthenticated() {
      patchState(store, (state) => ({ ...state, isAuthenticated: true }));
    },
    setAsUnauthenticated() {
      patchState(store, (state) => ({ ...state, isAuthenticated: false, meUser: null }));
    },
    setMeUser(user: UserModel) {
      patchState(store, (state) => ({ ...state, meUser: user }));
    }
  }))
);
