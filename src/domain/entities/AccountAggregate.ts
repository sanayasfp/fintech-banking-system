import { ulid } from "ulidx";
import type { IStatementPrinter } from "../../presentation/printers/IStatementPrinter";
import { AccountError } from "../errors/AccountError";
import { InsufficientFundsError } from "../errors/InsufficientFundsError";
import { InvalidAmountError } from "../errors/InvalidAmountError";
import type { IClock } from "../services/IClock";
import { Money } from "../value-objects/Money";
import { Transaction } from "../value-objects/Transaction";
import { AccountStatus, type IAccountAggregate, type IAccountFactory } from "./IAccountAggregate";

export interface AccountAggregateState {
    id: string;
    userId: string;
    accountNumber: string;
    status: AccountStatus;
    createdAt: Date;
    balance: Money;
    transactions: Transaction[];
    clock: IClock;
    printer: IStatementPrinter;
}

export class AccountAggregate implements IAccountAggregate {
    public readonly id: string;
    public readonly userId: string;
    public readonly accountNumber: string;
    public readonly createdAt: Date;

    private status: AccountStatus;
    private balance: Money;
    private readonly newTransactions: Transaction[];

    private readonly clock: IClock;
    private readonly printer: IStatementPrinter;

    constructor(props: AccountAggregateState) {
        this.id = props.id;
        this.userId = props.userId;
        this.accountNumber = props.accountNumber;
        this.status = props.status;
        this.createdAt = props.createdAt;
        this.balance = props.balance;
        this.newTransactions = props.transactions;
        this.clock = props.clock;
        this.printer = props.printer;
    }

    /**
     * Crée une instance pour un NOUVEAU compte bancaire.
     */
    public static create(data: IAccountFactory): IAccountAggregate {
        return new AccountAggregate({
            id: data.id ?? ulid(),
            userId: data.userId,
            accountNumber: data.accountNumber,
            status: AccountStatus.ACTIVE,
            createdAt: data.clock.now(),
            balance: Money.ZERO,
            transactions: [],
            clock: data.clock,
            printer: data.printer,
        });
    }

    public deposit(amount: Money): void {
        this.ensureIsActive();
        this.validateAmount(amount);

        const newBalance = this.balance.add(amount);
        const transaction = new Transaction(this.clock.now(), amount, newBalance);

        this.balance = newBalance;

        this.newTransactions.push(transaction);
    }

    public withdraw(amount: Money): void {
        this.ensureIsActive();
        this.validateAmount(amount);

        if (this.balance.isLessThan(amount)) {
            throw new InsufficientFundsError();
        }

        const withdrawalAmount = amount.negated();
        const newBalance = this.balance.add(withdrawalAmount);
        const transaction = new Transaction(this.clock.now(), withdrawalAmount, newBalance);

        this.balance = newBalance;

        this.newTransactions.push(transaction);
    }

    public printStatement(): void {
        this.printer.print(this.newTransactions);
    }

    public close(): void {
        this.ensureIsActive();
        if (!this.balance.isZero()) {
            throw new AccountError("Cannot close account with a non-zero balance.");
        }
        this.status = AccountStatus.CLOSED;
    }

    private validateAmount(amount: Money): void {
        if (amount.isNegative() || amount.isZero()) {
            throw new InvalidAmountError("Transaction amount must be a positive.");
        }
    }

    private ensureIsActive(): void {
        if (this.status !== AccountStatus.ACTIVE) {
            throw new AccountError(`Account ${this.id} is not active.`);
        }
    }

    public getNewTransactions(): ReadonlyArray<Transaction> {
        return this.newTransactions;
    }

    public clearNewTransactions(): void {
        this.newTransactions.length = 0;
    }

    public getBalance(): Money {
        return this.balance;
    }

    public getStatus(): AccountStatus {
        return this.status;
    }
}
