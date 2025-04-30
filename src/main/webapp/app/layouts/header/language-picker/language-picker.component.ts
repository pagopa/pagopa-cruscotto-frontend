import { Component, inject } from '@angular/core';
import dayjs from 'dayjs/esm';
import { LanguageService } from 'app/shared/language/language.service';
import { LANGUAGES } from '../../../config/language.constants';
import { StateStorageService } from '../../../core/auth/state-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import SharedModule from '../../../shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-language-picker',
  templateUrl: './language-picker.component.html',
  imports: [SharedModule, MatIconModule, MatButtonModule, MatMenuModule],
})
export default class LanguagePickerComponent {
  languages = LANGUAGES;

  languageSelected?: string;

  private readonly stateStorageService = inject(StateStorageService);
  private readonly languageService = inject(LanguageService);

  constructor() {
    this.languageSelected = this.languageService.getCurrentLanguage();
  }

  onLanguageChanged(language: string): void {
    this.stateStorageService.storeLocale(language);
    this.languageService.changeLanguage(language);
    dayjs.locale(language);
    this.languageSelected = this.languageService.getCurrentLanguage();
  }
}
