import {httpResource} from '@angular/common/http';
import {computed, inject, Injectable, Injector, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {LoginRequest} from '../model/login-request.model';
import {GenericResponse} from '../model/generic-response.model';
import {AuthResponse} from '../model/auth-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly injector = inject(Injector);
  private readonly router = inject(Router);

  private authState = signal({
    isAuthenticated: false,
    token: localStorage.getItem('access_token'),
    roles: [] as string[]
  });

  isAuthenticated = computed(() => this.authState().isAuthenticated);
  userRoles = computed(() => this.authState().roles);
  token = computed(() => this.authState().token);

  constructor() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const payload = this.parseJwt(token);
      this.authState.set({
        isAuthenticated: true,
        token,
        roles: payload.roles || []
      });
    }
  }

  login(credentials: LoginRequest): Observable<GenericResponse<AuthResponse>> {

    const resource = httpResource<GenericResponse<AuthResponse>>(
      () => ({
        url: 'http://localhost:8080/api/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
      {
        injector: this.injector
      }
    );

    const response = resource.value();
    if (response) {
      const token = response.data.accessToken;
      const payload = this.parseJwt(token);
      this.authState.set({
        isAuthenticated: true,
        token,
        roles: payload.roles || []
      });
      localStorage.setItem('access_token', token);
    }
    console.log(resource.value());

    return new Observable(observer => {
      if (this.isAuthenticated() && response) {
        observer.next(response);
      }
    });
  }

  logout(): Observable<void> {
    const resource = httpResource<GenericResponse>({
      url: 'http://localhost:8080/api/v1/auth/logout',
      method: 'GET'
    })

    if (resource.status().valueOf() === 200) {
      this.authState.set({
        isAuthenticated: false,
        token: null,
        roles: []
      });
      localStorage.removeItem('access_token');
      this.router.navigate(['/login']);
    }

    return new Observable(observer => {

    });
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  private parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRoles(): string[] {
    return this.getUserRolesFromToken(this.getToken() ? this.getToken() : '');
  }

  getUserRolesFromToken(token: string | null): string[] {

    if (!token) {
      return [];
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.groups || [];
  }
}
