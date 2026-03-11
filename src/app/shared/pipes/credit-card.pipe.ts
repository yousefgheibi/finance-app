import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'creditCard',
    standalone: true
})
export class CreditCardPipe implements PipeTransform {
    transform(value: string | number) {
        if (!value) return '';

        const digits = value.toString().replace(/\D/g, '');

        return digits.replace(/(.{4})/g, '$1 ').trim();
    }
}