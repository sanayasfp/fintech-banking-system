import type { Transaction } from "../../domain/value-objects/Transaction";

export interface IStatementPrinter {
    print(transactions: Transaction[]): void;
}
