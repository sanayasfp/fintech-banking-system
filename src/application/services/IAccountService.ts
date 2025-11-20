import type { IAccountAggregate } from "../../domain";
import type { Money } from "../../domain/value-objects/Money";

export interface IAccountService {
    createAccount(userId: string, accountNumber: string, initialBalance?: Money): Promise<IAccountAggregate>;
    deposit(accountId: string, amount: Money, userId?: string): Promise<void>;
    withdraw(accountId: string, amount: Money, userId?: string): Promise<void>;
    getBalance(accountId: string, userId?: string): Promise<Money>;
    listUserAccounts(userId: string): Promise<AccountListView[]>;
    closeAccount(accountId: string, userId?: string): Promise<void>;
}


export interface AccountListView {
    id: string;
    accountNumber: string;
    status: string;
    createdAt: Date;
    balance: Money;
}
