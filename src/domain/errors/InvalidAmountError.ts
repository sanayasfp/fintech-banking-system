import { DomainError } from "./DomainError";

export class InvalidAmountError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}
