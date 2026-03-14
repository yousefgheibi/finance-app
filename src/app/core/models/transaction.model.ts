import { TransactionType } from "../../shared/enums/transaction.enum";

export interface ITransactionDto {
    id?: number;
    type: TransactionType;
    cardName: string;
    categoryName: string;
    createdAt: string;
    price: number;
    description: string;
}