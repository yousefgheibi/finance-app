export interface ITransactionDto {
    id?: number;
    type: 'buy' | 'sell';
    cardName: string;
    categoryName: string;
    createdAt: string;
    price: number;
    description: string;
}