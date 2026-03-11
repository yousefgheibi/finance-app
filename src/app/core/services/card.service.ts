import { inject, Injectable } from "@angular/core";
import { IndexedDbService } from "./indexed-db.service";
import { from } from "rxjs";
import { ICreditCardDto } from "../models/credit-card.model";

@Injectable()
export class CreditCardService {

    private readonly db = inject(IndexedDbService);

    initDatabase() {
        return from(this.db.init());
    }

    loadData() {
        return from(this.db.getAll('cards'));
    }

    deleteCard(id: number) {
        return from(this.db.delete('cards', id));
    }

    updateCard(item: ICreditCardDto) {
        return from(this.db.update('cards', item));
    }

    addNewCard(item: ICreditCardDto) {
        return from(
            this.db.add('cards', {
                bankName: item.bankName,
                cardNumber: item.cardNumber
            })
        );
    }

}