import type { Transaction } from "../../domain/value-objects/Transaction";
import type { CursorPaginatedResult, CursorPaginationOptions } from "../queries/Pagination";

export type StatementFormat = "json" | "pdf" | "csv";

export interface GetStatementOptions extends Partial<CursorPaginationOptions> {
    startDate?: Date;
    endDate?: Date;
}

export interface IStatementService {
    getStatement(accountId: string, userId: string, options: GetStatementOptions): Promise<CursorPaginatedResult<Transaction>>;
    print(accountId: string, userId: string): Promise<void>;
    export(accountId: string, format: StatementFormat, userId: string): Promise<string>;
}
