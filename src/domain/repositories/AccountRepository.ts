import type { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import { Transaction } from "../../domain/value-objects/Transaction";
import { Money } from "../value-objects/Money";

export class InMemoryAccountRepository implements IAccountRepository {
    private readonly _storage: Transaction[] = [];

    public getAllTransactions(): Transaction[] {
        return [...this._storage];
    }

    public addTransaction(transaction: Transaction): void {
        this._storage.push(transaction);
    }

    public getCurrentBalance(): Money {
        const lastTransaction = this._storage[this._storage.length - 1];

        if (!lastTransaction) {
            return Money.from(0);
        }

        return lastTransaction.balance;
    }
}
