import {
  Component,
  computed,
  effect,
  inject,
  Injector, runInInjectionContext,
  Signal,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  MatCardModule
} from '@angular/material/card';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {
  MatInputModule
} from '@angular/material/input';
import {
  MatButtonModule
} from '@angular/material/button';
import {
  HttpErrorResponse,
  httpResource,
  HttpResourceRef
} from '@angular/common/http';
import { AuthService } from '../../shared/service/auth.service';
import { AuthResponse } from '../../shared/model/auth-response.model';
import {GenericResponse} from '../../shared/model/generic-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly injector = inject(Injector);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected loginResource: HttpResourceRef<GenericResponse> | undefined;
  protected resourceStatus: any;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  error = signal<string | null>(null);

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.loginResource = httpResource<any>(
        () => ({
          url: 'http://localhost:8080/api/v1/auth/login',
          method: 'POST',
          body: { username, password },
        }),
        {
          injector: this.injector
        }
      );

      this.resourceStatus = this.makeResourceRefStatus(this.loginResource);

      // Side effect to store token and redirect after successful login
      runInInjectionContext(this.injector, () => {
        effect(() => {
          const value = this.resourceStatus.value();
          if (value) {
            const accessToken = value.data?.accessToken;
            if (accessToken) {
              localStorage.setItem('access_token', accessToken);

              const roles = this.authService.getUserRolesFromToken(accessToken);
              if (roles.includes('ADMIN')) {
                this.router.navigate(['/home/admin']);
              } else {
                this.router.navigate(['/home/user']);
              }
            }
          }

          const error = this.resourceStatus.error();
          if (error && error.status === 401) {
            this.error.set('Invalid credentials');
          } else {
            this.error.set(null);
          }
        });
      });
    }
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
