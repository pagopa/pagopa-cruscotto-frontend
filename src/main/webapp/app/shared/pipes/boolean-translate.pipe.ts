import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'booleanTranslate',
})
export class BooleanTranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  /**
   * Trasforma un valore booleano in una stringa tradotta ("Sì"/"No" in italiano, "Yes"/"No" in inglese)
   *
   * @param value Il valore booleano da tradurre
   * @param locale Il locale corrente (opzionale). Se non fornito, utilizza quello della libreria TranslateService.
   * @returns Una stringa tradotta corrispondente al booleano.
   */
  transform(value: boolean, locale?: string): string {
    const currentLocale = locale || this.translateService.currentLang;

    // Gestione delle traduzioni per EN e IT
    if (currentLocale === 'it') {
      return value ? 'SI' : 'NO';
    } else if (currentLocale === 'en') {
      return value ? 'YES' : 'NO';
    }

    // Default (fallback)
    return value.toString();
  }
}
