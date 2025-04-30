import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import SharedModule from '../../shared/shared.module';
import { ErrorLayoutComponent } from '../error.layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'jhi-404-error',
  styleUrls: ['./404.component.scss'],
  template: `
    <jhi-error-layout>
      <router-outlet>
        <div class="row">
          <div class="col-md-12">
            <mat-card class="mat-elevation-z8" size="giant">
              <mat-card-content>
                <div class="flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12">
                  <h2 class="title">{{ 'error.404.title' | translate }}</h2>
                  <small class="sub-title">{{ 'error.404.message' | translate }}</small>
                  <button mat-button (click)="goToHome()" type="button" class="home-button w-100">
                    {{ 'error.404.button.label' | translate }}
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </router-outlet>
    </jhi-error-layout>
  `,
  imports: [SharedModule, ErrorLayoutComponent, MatCardModule, MatButtonModule, RouterModule],
})
export class Error404Component {
  constructor(private router: Router) {}

  goToHome(): void {
    void this.router.navigate(['home']);
  }
}
