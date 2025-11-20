import type { Money } from "./Money";

export interface ITransaction {
    readonly date: Date;
    readonly amount: Money;
    readonly balance: Money;
}
