import type { Money } from "../value-objects/Money";
import type { Transaction } from "../value-objects/Transaction";

export enum AccountStatus {
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED",
    SUSPENDED = "SUSPENDED",
}

export interface IAccount {
    readonly id: string;
    readonly accountNumber: string;
    readonly balance: Money;

    deposit(amount: Money): void;
    withdraw(amount: Money): void;
    printStatement(): void;
}

export interface IAccountAggregate extends IAccount {
    readonly userId: string;
    readonly createdAt: Date;
    readonly status: AccountStatus;

    getBalance(): Money;
    getTransactions(): ReadonlyArray<Transaction>;
    close(): void;
}
