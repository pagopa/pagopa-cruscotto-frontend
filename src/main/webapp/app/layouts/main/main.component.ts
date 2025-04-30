import { Component, inject, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AccountService } from '../../core/auth/account.service';
import { LocaltionHelper } from '../../core/location/location.helper';
import { NgxLoadingBar } from '@ngx-loading-bar/core';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AppPageTitleStrategy } from '../../app-page-title-strategy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import AlertToastrComponent from '../header/alert.component';

@Component({
  standalone: true,
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy],
  imports: [
    NgxLoadingBar,
    NgxSpinnerComponent,
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AlertToastrComponent,
  ],
})
export class MainComponent implements OnInit {
  private renderer: Renderer2;
  private readonly router = inject(Router);
  // private readonly ccService = inject(NgcCookieConsentService);
  private readonly accountService = inject(AccountService);
  private readonly translateService = inject(TranslateService);
  private readonly rootRenderer = inject(RendererFactory2);
  private readonly locationHelper = inject(LocaltionHelper);
  private readonly appPageTitleStrategy = inject(AppPageTitleStrategy);

  constructor() {
    this.renderer = this.rootRenderer.createRenderer(document.querySelector('html'), null);
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        /* eslint-disable no-console */
        console.group('NavigationStart Event');
        console.log('navigation id:', event.id);
        console.log('route:', event.url);
        console.log('trigger:', event.navigationTrigger);

        if (event.navigationTrigger === 'popstate') {
          this.locationHelper.updateIsBack(true);
        } else {
          this.locationHelper.updateIsBack(false);
        }

        if (event.restoredState) {
          console.warn('restoring navigation id:', event.restoredState.navigationId);
        }

        console.groupEnd();
      }
    });

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.appPageTitleStrategy.updateTitle(this.router.routerState.snapshot);
      // this.cookieLanguage();
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });
  }

  private cookieLanguage(): void {
    this.translateService
      .get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.policy'])
      .subscribe(data => {
        console.log(data);
        // console.log(this.ccService.getConfig());
        // this.ccService.getConfig().content = this.ccService.getConfig().content ?? {};
        // // Override default messages with the translated ones
        // this.ccService.getConfig().content!.header = data['cookie.header'];
        // this.ccService.getConfig().content!.message = data['cookie.message'];
        // this.ccService.getConfig().content!.dismiss = data['cookie.dismiss'];
        // this.ccService.getConfig().content!.allow = data['cookie.allow'];
        // this.ccService.getConfig().content!.deny = data['cookie.deny'];
        // this.ccService.getConfig().content!.link = data['cookie.link'];
        // this.ccService.getConfig().content!.policy = data['cookie.policy'];
        //
        // this.ccService.destroy();
        // this.ccService.init(this.ccService.getConfig());
      });
  }
}
