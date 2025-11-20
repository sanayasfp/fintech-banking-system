import type { BankAccount } from "../../domain/entities/BankAccount";
import { Transaction } from "../../domain/value-objects/Transaction";
import type { IStatementPrinter } from "../../presentation/printers/IStatementPrinter";
import { InsufficientFundsError } from "../errors/InsufficientFundsError";
import { InvalidAmountError } from "../errors/InvalidAmountError";
import type { IAccountRepository } from "../repositories/IAccountRepository";
import type { IClock } from "../services/IClock";
import type { Money } from "../value-objects/Money";

export class BankAccountImpl implements BankAccount {
    constructor(
        private readonly repository: IAccountRepository,
        private readonly clock: IClock,
        private readonly printer: IStatementPrinter,
    ) {}

    deposit(amount: Money): void {
        this.validateAmount(amount);

        const currentBalance = this.repository.getCurrentBalance();
        const newBalance = currentBalance.add(amount);
        const transaction = new Transaction(this.clock.now(), amount, newBalance);

        this.repository.addTransaction(transaction);
    }

    withdraw(amount: Money): void {
        this.validateAmount(amount);

        const currentBalance = this.repository.getCurrentBalance();

        if (currentBalance.isLessThan(amount)) {
            throw new InsufficientFundsError();
        }

        const withdrawalAmount = amount.negated();
        const newBalance = currentBalance.add(withdrawalAmount);
        const transaction = new Transaction(this.clock.now(), withdrawalAmount, newBalance);

        this.repository.addTransaction(transaction);
    }

    printStatement(): void {
        const transactions = this.repository.getAllTransactions();

        this.printer.print(transactions);
    }

    private validateAmount(amount: Money): void {
        if (amount.isNegative() || amount.isZero()) {
            throw new InvalidAmountError("Transaction amount must be a positive.");
        }
    }
}
