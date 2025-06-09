import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import FindLanguageFromKeyPipe from './language/find-language-from-key.pipe';
import TranslateDirective from './language/translate.directive';
import HasAnyAuthorityDirective from './auth/has-any-authority.directive';
import { HasAnyAuthorityMenuDirective } from './auth/has-any-authority-menu.directive';

/**
 * Application wide Module
 */
@NgModule({
  imports: [FindLanguageFromKeyPipe, TranslateDirective, HasAnyAuthorityMenuDirective, HasAnyAuthorityDirective],
  exports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    TranslateModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    HasAnyAuthorityMenuDirective,
    HasAnyAuthorityDirective,
  ],
})
export default class SharedModule {}
