import {Component, effect, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {AppStore} from '../shared/store/app.store';
import {httpResource} from '@angular/common/http';
import {patchState, signalState} from '@ngrx/signals';
import {environment} from '../environments/environment';
import {GenericResponseModel} from '../shared/model/generic-response.model';
import {UserModel} from '../shared/model/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  protected readonly appStore = inject(AppStore);

  homeState = signalState({
    isGettingSecret : false,
    adminData: '',
  });

  meUserResource = httpResource<GenericResponseModel<UserModel>>(
    () => `${environment.apiUrl}/api/v1/users`,
  );

  adminResource = httpResource<GenericResponseModel<string>>(
    () => this.homeState.isGettingSecret() ? `${environment.apiUrl}/api/v1/admin` : undefined,
  );

  constructor() {
    effect(() => {
      const genericRes = this.meUserResource.value();
      if (genericRes?.data) {
        this.appStore.setMeUser(genericRes.data);
      }
    });

    effect(() => {
      const genericRes = this.adminResource.value();
      if (genericRes?.data) {
        patchState(this.homeState, (state) => ({
          ...state,
          adminData: genericRes.data
        }));
      }
    });

    effect(() => {
      const meUser = this.appStore.meUser();

      if (this.adminResource.statusCode() === 403 && meUser) {
        patchState(this.homeState, (state) => ({
          ...state,
          isGettingSecret: false,
          adminData: `You are ${meUser.roles.join(', ')} so you are not able to access this resource`
        }));
      }
    });
  }

  onGetSecretText() {
    patchState(this.homeState, (state) => ({
      ...state,
      isGettingSecret: true
    }));
  }

  onHideSecretText() {
    patchState(this.homeState, (state) => ({
      ...state,
      isGettingSecret: false,
      adminData: ''
    }));
  }
}
