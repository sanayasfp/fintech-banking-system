import type { IAccountAggregate } from "../../domain";
import type { Money } from "../../domain/value-objects/Money";
import type { AccountListView } from "../queries/IAccountQueries";
import type { CursorPaginatedResult, CursorPaginationOptions } from "../queries/Pagination";

export interface IAccountService {
    createAccount(
        userId: string,
        accountNumber: string,
        initialBalance?: Money,
    ): Promise<IAccountAggregate>;
    deposit(accountId: string, amount: Money, userId?: string): Promise<void>;
    withdraw(accountId: string, amount: Money, userId?: string): Promise<void>;
    getBalance(accountId: string, userId?: string): Promise<Money>;
    listUserAccounts(
        userId: string,
        options: CursorPaginationOptions,
    ): Promise<CursorPaginatedResult<AccountListView>>;
    closeAccount(accountId: string, userId?: string): Promise<void>;
}
