import { DomainError } from "./DomainError";

export class AccountError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}
