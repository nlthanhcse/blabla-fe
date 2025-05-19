import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {AuthService} from './shared/service/auth.service';
import {AppStore} from './shared/store/app.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private readonly authService = inject(AuthService);
  protected readonly appStore = inject(AppStore);

  logout() {
    this.authService.logout();
    this.appStore.setAsUnauthenticated();
  }
}
