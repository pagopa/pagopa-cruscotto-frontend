import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'averageFormat',
})
export class AverageFormatPipe implements PipeTransform {
  /**
   * Transforms a numeric value into a formatted string with specified decimals, replacing the decimal separator with a comma and appending a percentage sign.
   *
   * @param {any} value - The input value to be transformed. It is expected to be a numeric value or a string that can be parsed as a number.
   * @param {number} [decimals=5] - The number of decimal places to retain in the formatted output. Defaults to 5.
   * @return {string} A formatted string representing the numeric value with specified decimals, a comma as the decimal separator, and a percentage sign. Returns an empty string if the input is invalid or cannot be parsed as a number.
   */
  transform(value: any, decimals: number = 5): string {
    if (value === null || value === undefined || isNaN(parseFloat(value))) {
      return '';
    }
    const numericValue = parseFloat(value);
    const formattedValue = numericValue.toFixed(decimals);
    return formattedValue.replace('.', ',') + ' %';
  }
}
