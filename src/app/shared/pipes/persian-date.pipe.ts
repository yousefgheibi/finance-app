import { Pipe, PipeTransform } from "@angular/core";
import { toJalaali } from "jalaali-js";

@Pipe({
    name: 'PersianDate',
    standalone: true
})
export class PersianDatePipe implements PipeTransform {
    transform(value: Date | string | null | undefined, format: 'datetime' | 'date' = 'date') {
        if (!value) return '';
        const date = new Date(value);

        const jalaliDate = toJalaali(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        );

        const year = jalaliDate.jy;
        const month = jalaliDate.jm.toString().padStart(2, '0');
        const day = jalaliDate.jd.toString().padStart(2, '0');


        const baseDate = `${year}/${month}/${day}`;

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (format === 'datetime') {
            return `${baseDate} ${hours}:${minutes}`;
        }
        else {
            return baseDate;
        }
    }
}