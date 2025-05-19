import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <h1 class="text-3xl font-bold text-red-600">Access Denied</h1>
      <p class="mt-4 text-lg">You are not allowed to access this page.</p>
      <button
        class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        (click)="goBack()">
        Go Back
      </button>
    </div>
  `,
  styles: []
})
export class ForbiddenComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
