import type { Transaction } from "../value-objects/Transaction";

export interface Statement {
    readonly accountId: string;
    readonly generatedAt: Date;
    readonly transactions: ReadonlyArray<Transaction>;
}
