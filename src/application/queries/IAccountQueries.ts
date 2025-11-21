import type { Money } from "../../domain/value-objects/Money";
import type { AccountStatus } from "../../domain/entities/IAccountAggregate";
import type { CursorPaginatedResult, CursorPaginationOptions } from "./Pagination";
import type { Transaction } from "../../domain/value-objects/Transaction";
import type { GetStatementOptions } from "../services";

export interface AccountListView {
    id: string;
    accountNumber: string;
    balance: Money;
    status: AccountStatus;
    createdAt: Date;
}

export interface IAccountQueries {
    getBalance(accountId: string): Promise<Money>;
    getStatement(
        accountId: string,
        options: GetStatementOptions,
    ): Promise<CursorPaginatedResult<Transaction>>;
    listAccountsByUser(
        userId: string,
        options: CursorPaginationOptions,
    ): Promise<CursorPaginatedResult<AccountListView>>;
}
