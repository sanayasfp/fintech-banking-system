import type { ITransaction } from "./ITransaction";
import type { Money } from "./Money";

export class Transaction implements ITransaction {
    constructor(
        public readonly date: Date,
        public readonly amount: Money,
        public readonly balance: Money,
    ) {
        Object.freeze(this);
    }
}
