import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'datetimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {
    transform(value: any): number {
        // @ts-ignore
        return this.localeString(value);
    }

    localeString(nStr: Date) {
        if (nStr) {
            return (nStr.getDate() + "").padStart(2, "0") + '/' + ((nStr.getMonth() + 1) + '').padStart(2, "0") + '/' + nStr.getFullYear() + " " +
                (nStr.getHours() + "").padStart(2, "0") + ':' + ((nStr.getMinutes()) + '').padStart(2, "0") + ':' + ((nStr.getSeconds()) + '').padStart(2, "0");
        } else {
            return null;
        }
    }
}
