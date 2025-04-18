import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentLang = 'it';

  constructor(private translateService: TranslateService) {}

  init(): void {
    this.translateService.setDefaultLang(this.currentLang);
    this.translateService.use(this.currentLang);
  }

  changeLanguage(languageKey: string): void {
    this.currentLang = languageKey;
    this.translateService.use(this.currentLang);
  }

  getCurrent(): Promise<string> {
    return Promise.resolve(this.currentLang);
  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }
}
