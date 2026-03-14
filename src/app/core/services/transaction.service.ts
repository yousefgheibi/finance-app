import { inject, Injectable } from "@angular/core";
import { IndexedDbService } from "./indexed-db.service";
import { from, map } from "rxjs";
import { ITransactionDto } from "../models/transaction.model";
import { TransactionType } from "../../shared/enums/transaction.enum";
import { Period } from "../../shared/enums/period.enum";

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

    getTransactionSummary(type: TransactionType, period: Period) {
        return this.loadData().pipe(
            map((items: ITransactionDto[]) => {

                const now = new Date();

                const filtered = items.filter(item => {

                    if (item.type !== type) return false;

                    const date = new Date(item.createdAt);

                    switch (period) {

                        case Period.Today:
                            return date.toDateString() === now.toDateString();

                        case Period.Yesterday:
                            const yesterday = new Date();
                            yesterday.setDate(now.getDate() - 1);
                            return date.toDateString() === yesterday.toDateString();

                        case Period.Week:
                            const lastWeek = new Date();
                            lastWeek.setDate(now.getDate() - 7);
                            return date >= lastWeek && date <= now;

                        case Period.Month:
                            const lastMonth = new Date();
                            lastMonth.setMonth(now.getMonth() - 1);
                            return date >= lastMonth && date <= now;

                        default:
                            return false;
                    }

                });

                return {
                    total: filtered.reduce((sum, t) => sum + t.price, 0),
                    count: filtered.length
                };

            })
        );
    }
}