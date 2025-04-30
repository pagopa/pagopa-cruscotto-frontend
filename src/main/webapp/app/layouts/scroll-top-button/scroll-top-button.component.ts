import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import SharedModule from '../../shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-scroll-top-button',
  templateUrl: './scroll-top-button.component.html',
  styleUrls: ['./scroll-top-button.component.scss'],
  imports: [SharedModule, MatButtonModule, MatIconModule],
})
export default class ScrollTopButtonComponent {
  canScrollTop = false;
  scroll: any;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @HostListener('window:scroll', []) windowScrolled(): void {
    const scrollValue = window.scrollY || document.documentElement.scrollTop;

    this.scroll = scrollValue;
    if (scrollValue > 50) {
      this.canScrollTop = true;
    } else if (this.canScrollTop && scrollValue < 10) {
      this.canScrollTop = false;
    }
  }

  scrollTop(): void {
    window.scrollTo(0, 0);
  }
}
