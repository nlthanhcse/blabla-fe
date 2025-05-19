import {Component, computed, effect, inject, Injector, runInInjectionContext} from '@angular/core';
import {CommonModule} from '@angular/common';
import {patchState, signalState} from '@ngrx/signals';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {AuthService} from '../shared/service/auth.service';
import {UserService} from '../shared/service/user.service';
import {AdminService} from '../shared/service/admin.service';
import {HttpErrorResponse, httpResource, HttpResourceRef} from '@angular/common/http';
import {GenericResponse} from '../shared/model/generic-response.model';
import {AuthResponse} from '../shared/model/auth-response.model';
import {Router} from '@angular/router';

interface HomeState {
  userData: string;
  adminData: string;
  loading: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly adminService = inject(AdminService);

  state = signalState<HomeState>({
    userData: '',
    adminData: '',
    loading: false
  });

  constructor() {
    if (this.authService.hasRole('USER')) {
      const res = httpResource<GenericResponse>('http://localhost:8080/api/v1/user').value();
      patchState(this.state, { userData: res ? res.data : '' });

    }

    if (this.authService.hasRole('ADMIN')) {
      const res = httpResource<GenericResponse>('http://localhost:8080/api/v1/admin').value();
      patchState(this.state, { adminData: res ? res.data : '' });
    }
  }

  logout() {

    const logoutResource = httpResource<any>(() => ({
      url: 'http://localhost:8080/api/v1/auth/logout',
      method: 'GET'
    }), { injector: this.injector });
    const resourceStatus = this.makeResourceRefStatus(logoutResource);

    // Side effect to store token and redirect after successful login
    runInInjectionContext(this.injector, () => {
      effect(() => {
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      });
    });
  }

  makeResourceRefStatus(resourceRef: HttpResourceRef<GenericResponse<AuthResponse>>) {
    return {
      error: computed(() =>
        resourceRef.error() ? resourceRef.error() as HttpErrorResponse : undefined
      ),
      statusCode: computed(() => resourceRef.statusCode() ? resourceRef.statusCode() : undefined),
      headers: computed(() => resourceRef.headers() ? resourceRef.headers() : undefined),
      value: computed(() => resourceRef.hasValue() ? resourceRef.value() : undefined)
    };
  }
}
