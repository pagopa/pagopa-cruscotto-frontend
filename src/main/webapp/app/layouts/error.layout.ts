import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'jhi-error-layout',
  styleUrls: ['./error.layout.scss'],
  template: `
    <div class="container-fluid">
      <ng-content select="router-outlet"></ng-content>
    </div>
  `,
})
export class ErrorLayoutComponent {}
