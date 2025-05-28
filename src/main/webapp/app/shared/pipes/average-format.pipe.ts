import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'averageFormat',
})
export class AverageFormatPipe implements PipeTransform {
  /**
   * Trasforma i numeri in formato decimale italiano e aggiunge il simbolo %
   * @param value Il valore numerico da formattare (può essere null o stringa)
   * @param decimals Numero di cifre decimali (default: 5)
   * @returns Ritorna il valore formattato. Se valore nullo o invalido: "0,00 %" o "0,00000 %"
   */
  transform(value: any, decimals: number = 5): string {
    // Controlla se il valore è nullo, undefined, o invalido
    if (value === null || value === undefined || isNaN(parseFloat(value))) {
      return decimals === 2 ? '0,00 %' : '0,00000 %';
    }
    const numericValue = parseFloat(value);
    const formattedValue = numericValue.toFixed(decimals);
    return formattedValue.replace('.', ',') + ' %';
  }
}
