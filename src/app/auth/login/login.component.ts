import {Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {HttpErrorResponse, HttpResourceRef} from '@angular/common/http';
import {AuthService} from '../../shared/service/auth.service';
import {AuthResponseModel} from '../../shared/model/auth-response.model';
import {KEYS} from '../../shared/constant/application.constant';
import {AppStore} from '../../shared/store/app.store';
import {GenericResponseModel} from '../../shared/model/generic-response.model';

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

  private readonly appStore = inject(AppStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly fb = inject(FormBuilder);
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loginError = signal<string | null>(null);

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(
        { username, password }
      )
        .subscribe({
          next: (res) => {
            const data = res.data as AuthResponseModel;
            this.authService.handleSuccessfulLogin(data);
            this.navigateHome();
          },
          error: (e) => {
            if (401 === e.status) {
              this.loginError.update(value => 'Invalid email or password');
            } else {
              this.loginError.update(value => (e.error as GenericResponseModel).messageDetails[0]);
            }
          },
          complete: () => {
          }
        });
    }
  }

  navigateHome() {
    console.log('navigate home');
    this.router.navigate(['/home']);
  }

  makeResourceRefStatus(resourceRef: HttpResourceRef<GenericResponseModel<AuthResponseModel>>) {
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
