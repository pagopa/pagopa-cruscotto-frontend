import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findLanguageFromKey',
})
export default class FindLanguageFromKeyPipe implements PipeTransform {
  private readonly languages: Record<string, { name: string; rtl?: boolean }> = {
    it: { name: 'Italiano' },
    en: { name: 'English' },
  };

  transform(lang: string): string {
    return this.languages[lang].name;
  }
}
