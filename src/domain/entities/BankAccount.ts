import type { Money } from "../value-objects/Money";

export interface BankAccount {
    deposit(amount: Money): void;
    withdraw(amount: Money): void;
    printStatement(): void;
}
