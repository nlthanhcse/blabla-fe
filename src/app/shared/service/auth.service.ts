import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {finalize} from 'rxjs';
import {LoginRequestModel} from '../model/login-request.model';
import {AuthResponseModel} from '../model/auth-response.model';
import {environment} from '../../environments/environment';
import {AppStore} from '../store/app.store';
import {KEYS} from '../constant/application.constant';
import {GenericResponseModel} from '../model/generic-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  static readonly Endpoint =  {
    LOGIN: "/login",
    LOGOUT: "/logout",
  }

  private BASE_URL: string = environment.apiUrl + "/api/v1/auth";

  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AppStore);

  login(loginRequest: LoginRequestModel) {
    this.authStore.startLogin();

    return this.http.post<GenericResponseModel<AuthResponseModel>>(
      this.BASE_URL + AuthService.Endpoint.LOGIN,
      loginRequest
    ).pipe(
      finalize(() => this.authStore.stopLogin())
    );
  }

  logout(): void {
    localStorage.removeItem(KEYS.AUTH_TOKEN);
    location.reload();
  }

  handleSuccessfulLogin(data: AuthResponseModel) {
    localStorage.setItem(KEYS.AUTH_TOKEN, data.accessToken);
    this.authStore.setAsAuthenticated();
  }

  getToken(): string | null {
    return localStorage.getItem(KEYS.AUTH_TOKEN);
  }

}
