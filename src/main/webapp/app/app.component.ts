import { Component, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import dayjs from 'dayjs/esm';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import locale from '@angular/common/locales/it';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { LanguageService } from './shared/language/language.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MainComponent } from './layouts/main/main.component';

@Component({
  selector: 'jhi-app',
  template: '<jhi-main></jhi-main>',
  imports: [MainComponent],
})
export default class AppComponent {
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly iconLibrary = inject(FaIconLibrary);
  private readonly languageService = inject(LanguageService);
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    dayjs.locale(this.languageService.getCurrentLanguage());
    registerLocaleData(locale);
    this.iconLibrary.addIcons(...fontAwesomeIcons);
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    this.matIconRegistry.addSvgIcon(
      'visibility',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/visibility_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/edit_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/delete_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'download',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/download_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'file_save',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/file_save_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'search',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/search_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'ink_eraser',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/ink_eraser_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'arrow_back',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/arrow_back_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'undo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/undo_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'add_circle',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/add_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'cancel',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/cancel_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'save',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/save_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'close',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/close_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'arrow_drop_down',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/arrow_drop_down_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'handshake',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/handshake_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'more_vert',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'login',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/login_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'manage_account',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/manage_accounts_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'password',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/password_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'cookie',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/cookie_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'settings',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/settings_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'settings_account',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/settings_account_box_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'visibility_off',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/visibility_off_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'account_balance',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/account_balance_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'dashboard',
      this.domSanitizer.bypassSecurityTrustResourceUrl('content/svg/dashboard_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'),
    );
  }
}
