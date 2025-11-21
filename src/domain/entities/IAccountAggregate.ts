import type { IStatementPrinter } from "../../presentation/printers/IStatementPrinter";
import type { IClock } from "../services/IClock";
import type { Money } from "../value-objects/Money";
import type { Transaction } from "../value-objects/Transaction";
import type { BankAccount } from "./BankAccount";

export enum AccountStatus {
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED",
    SUSPENDED = "SUSPENDED",
}

export interface IAccountAggregate extends BankAccount {
    readonly id: string;
    readonly accountNumber: string;
    readonly userId: string;
    readonly createdAt: Date;

    getBalance(): Money;
    getStatus(): AccountStatus;
    getNewTransactions(): ReadonlyArray<Transaction>;
    clearNewTransactions(): void;
    close(): void;
}

export interface IAccountFactory {
    id?: string;
    userId: string;
    accountNumber: string;
    clock: IClock;
    printer: IStatementPrinter;
    createdAt?: Date;
    status?: AccountStatus;
    transactions?: Transaction[];
    balance?: Money;
}

export interface IAccountFactoryFunc {
    (data: IAccountFactory): IAccountAggregate;
}
