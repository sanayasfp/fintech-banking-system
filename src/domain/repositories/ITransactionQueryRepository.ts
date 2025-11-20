import type { Transaction } from "../value-objects/Transaction";

export interface ITransactionQueryRepository {
    findByAccountId(accountId: string): Promise<Transaction[]>;
    findRecent(accountId: string, limit: number): Promise<Transaction[]>;
    findByDateRange(
        accountId: string,
        from: Date,
        to: Date,
    ): Promise<Transaction[]>;
}
