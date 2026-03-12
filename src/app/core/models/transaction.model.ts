export interface ITransactionDto {
    id?: number;
    type: 'withdraw' | 'deposit';
    cardName: string;
    categoryName: string;
    createdAt: string;
    price: number;
    description: string;
}