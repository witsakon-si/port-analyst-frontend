
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: any): number {
    // @ts-ignore
    return this.localeString(value);
  }

  transform2(value: any): number {
    // @ts-ignore
    return this.localeString(value.toFixed(2));
  }

  transform8(value: any): number {
    // @ts-ignore
    return this.localeString(value.toFixed(8));
  }

  localeString(nStr: string) {
    if (nStr) {
      const arr = nStr.toString().split('.');
      return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (arr.length > 1 ? '.' + arr[1] : '');
    } else {
      return '0.00';
    }
  }
}
