import { inject, Injectable } from "@angular/core";
import { IndexedDbService } from "./indexed-db.service";
import { from } from "rxjs";
import { ITransactionDto } from "../models/transaction.model";

@Injectable()
export class TransactionService {

    private readonly db = inject(IndexedDbService);

    initDatabase() {
        return from(this.db.init());
    }

    loadData() {
        return from(this.db.getAll('transactions'));
    }

    deleteTransaction(id: number) {
        return from(this.db.delete('transactions', id));
    }

    updateTransaction(item: ITransactionDto) {
        return from(this.db.update('transactions', item));
    }

    addNewTransaction(item: ITransactionDto) {
        return from(
            this.db.add('transactions', {
                type: item.type,
                categoryName: item.categoryName,
                cardName: item.cardName,
                description: item.description,
                createdAt: item.createdAt,
                price: item.price
            })
        );
    }

}