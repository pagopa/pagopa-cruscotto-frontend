import { Component } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
})
export default class FooterComponent {
  version = '';

  constructor() {
    const { VERSION } = environment;
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }
}
