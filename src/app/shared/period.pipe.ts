
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'periodFormat'
})
export class PeriodFormatPipe implements PipeTransform {
  transform(d: number, m: number, y: number): string {
    let result = "";
    if(y) {
      result += y + 'y ';
    }
    if(m) {
      result += m + 'm ';
    }
    if(d) {
      result += d + 'd ';
    }
    return result;
  }
}
