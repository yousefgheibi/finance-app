import { inject, Injectable } from "@angular/core";
import { IndexedDbService } from "./indexed-db.service";
import { from, map } from "rxjs";
import { ITransactionDto } from "../models/transaction.model";
import { TransactionType } from "../../shared/enums/transaction.enum";
import { Period } from "../../shared/enums/period.enum";
import { TransactionSummary } from "../models/transaction-summary.model";
import { toJalaali } from "jalaali-js";
import { TransactionAnnualSummary } from "../models/transaction-annual-summary.model";

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

    getTransactionSummary(items: ITransactionDto[], type: TransactionType, period: Period): TransactionSummary {
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
            total: filtered.reduce((sum, t) => sum + Number(t.price), 0),
            count: filtered.length
        };
    }

    getTransactionsAnnualSummary(transactions: ITransactionDto[], fiscalYear: number): TransactionAnnualSummary[] {
        const months: TransactionAnnualSummary[] = [];

        const groupedByMonth = transactions
            .filter(transaction => toJalaali(new Date(transaction.createdAt)).jy === fiscalYear)
            .reduce((acc, transaction) => {
                const jalaaliDate = toJalaali(new Date(transaction.createdAt));
                const month = jalaaliDate.jm;

                if (!acc[month]) {
                    acc[month] = {
                        withdrawals: 0,
                        deposits: 0,
                    };
                }
                acc[month][transaction.type === TransactionType.Withdrawal ? 'withdrawals' : 'deposits'] += Number(transaction.price);
                return acc;
            }, {} as any);

        for (let month = 1; month <= 12; month++) {
            months.push({
                month: month,
                withdrawals: groupedByMonth[month]?.withdrawals || 0,
                deposits: groupedByMonth[month]?.deposits || 0,
            });
        }

        return months;
    }

    getWithdrawalTransactionsFilterByCategory(transactions: ITransactionDto[], fiscalYear: number) {
        return transactions
            .filter(transaction => toJalaali(new Date(transaction.createdAt)).jy === fiscalYear)
            .filter(transaction => transaction.type === TransactionType.Withdrawal)
            .reduce((acc, transaction) => {
                if (!acc[transaction.categoryName]) {
                    acc[transaction.categoryName] = 0;
                }
                acc[transaction.categoryName] += Number(transaction.price)
                return acc;
            }, {} as any)
    }
}