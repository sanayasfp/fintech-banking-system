import { DomainError } from "./DomainError";

export class DuplicateAccountNumberError extends DomainError {
    constructor(accountNumber: string | number) {
        super(`An account with the number "${accountNumber}" already exists.`);
    }
}
