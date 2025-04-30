import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import FooterComponent from './footer/footer.component';
import HeaderComponent from './header/header.component';
import ScrollTopButtonComponent from './scroll-top-button/scroll-top-button.component';

@Component({
  standalone: true,
  selector: 'jhi-layout',
  styleUrls: ['./sample.layout.scss'],
  template: `
    <jhi-ngx-header></jhi-ngx-header>
    <main>
      <div class="content">
        <div class="content-inside">
          <router-outlet></router-outlet>
        </div>
      </div>
    </main>
    <jhi-footer></jhi-footer>
    <jhi-scroll-top-button></jhi-scroll-top-button>
  `,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, ScrollTopButtonComponent],
})
export class SampleLayoutComponent {}
