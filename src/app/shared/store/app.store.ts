import {signalStore, withState} from '@ngrx/signals';

type AppState = {
  isAuthenticated: boolean;
  token: string;
  roles: string[];
}

const initialState: AppState = {
  isAuthenticated: false,
  token: '',
  roles: []
}

export const AppStore = signalStore(
  { protectedState: false },
  withState(initialState)
)
