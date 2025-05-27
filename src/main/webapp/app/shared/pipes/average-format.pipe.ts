import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'averageFormat',
})
export class AverageFormatPipe implements PipeTransform {
  /**
   * Trasforma i numeri in formato decimale italiano e aggiunge il simbolo %
   * @param value Il numero da formattare
   * @param decimals Numero di cifre decimali (default: 5)
   * @returns Ritorna il valore formattato
   */
  transform(value: number, decimals: number = 5): string {
    if (isNaN(value) && decimals == 5) return '0,00000 %'; // Gestisce il caso di valore nullo o non numerico
    if (isNaN(value) && decimals == 2) return '0,00 %';
    // Usa `toFixed` per assicurarsi di mantenere un numero fisso di cifre decimali
    const formattedValue = value.toFixed(decimals); // Esempio: 0.1 --> '0.10000'
    // Sostituisci il punto con la virgola per il formato italiano
    return formattedValue.replace('.', ',') + ' %'; // Esempio: '0.10000' --> '0,10000 %'
  }
}
