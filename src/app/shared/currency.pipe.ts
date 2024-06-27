
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyPipe implements PipeTransform {
  transform(value: any): number {
    // @ts-ignore
    return value == 0 ? '0.00' : this.localeString(value);
  }

  localeString(nStr: string) {
    if (nStr) {
      const arr = nStr.toString().split('.');
      let decimal = '.00';
      if (arr.length > 1) {
        if (arr[1].length >= 2) {
          decimal = '.' + arr[1];
        } else if (arr[1].length == 1) {
          decimal = '.' + arr[1] + '0';
        }
      }
      return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimal;
    } else {
      return null;
    }
  }
}
