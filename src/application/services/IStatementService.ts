import type { Statement } from "../../domain";

export type StatementFormat = "json" | "pdf" | "csv";

export interface IStatementService {
    getStatement(accountId: string, userId?: string): Promise<Statement>;
    print(accountId: string, userId?: string): Promise<void>;
    export(accountId: string, format: StatementFormat, userId?: string): Promise<string>;
}
