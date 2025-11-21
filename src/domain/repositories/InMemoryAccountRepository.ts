import type { IAccountRepository } from "./IAccountRepository";
import { Transaction } from "../value-objects/Transaction";
import type { IAccountAggregate } from "../entities/IAccountAggregate";
import { Money } from "../value-objects/Money";

export class InMemoryAccountRepository implements IAccountRepository {
    private readonly _accounts: Map<string, IAccountAggregate> = new Map();
    private readonly _accountsByNumber: Map<string, IAccountAggregate> = new Map();
    private readonly _storage: Transaction[] = [];

    async findById(id: string): Promise<IAccountAggregate | null> {
        return this._accounts.get(id) ?? null;
    }

    async findByAccountNumber(accountNumber: string): Promise<IAccountAggregate | null> {
        return this._accountsByNumber.get(accountNumber) ?? null;
    }

    async save(account: IAccountAggregate): Promise<void> {
        this._accounts.set(account.id, account);
        this._accountsByNumber.set(account.accountNumber, account);
    }

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
