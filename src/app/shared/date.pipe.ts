
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any): number {
    // @ts-ignore
    return this.localeString(value);
  }

  localeString(nStr: Date) {
    if (nStr) {
      return (nStr.getDate() + "").padStart(2, "0") + '/' + ((nStr.getMonth() + 1) + '').padStart(2, "0") + '/' + nStr.getFullYear();
    } else {
      return null;
    }
  }
}
