import { DomainError } from "./DomainError";

export class InsufficientFundsError extends DomainError {
    constructor() {
        super("Insufficient funds for this withdrawal.");
    }
}
