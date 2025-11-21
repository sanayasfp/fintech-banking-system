import type { IAuthorizationService } from "../../domain";
import { AccountError } from "../../domain/errors/AccountError";
import type { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import type { Transaction } from "../../domain/value-objects/Transaction";
import type { IStatementPrinter } from "../../presentation/printers/IStatementPrinter";
import type { IAccountQueries } from "../queries/IAccountQueries";
import type { CursorPaginatedResult } from "../queries/Pagination";
import type { GetStatementOptions, IStatementService, StatementFormat } from "./IStatementService";

export interface StatementServiceDeps {
    readonly accountRepository: IAccountRepository;
    readonly accountQueries: IAccountQueries;
    readonly authorizationService: IAuthorizationService;
    readonly printer: IStatementPrinter;
}

export class StatementService implements IStatementService {
    private readonly accountRepository: IAccountRepository;
    private readonly accountQueries: IAccountQueries;
    private readonly authorizationService: IAuthorizationService;
    private readonly printer: IStatementPrinter;

    constructor(deps: StatementServiceDeps) {
        this.accountRepository = deps.accountRepository;
        this.accountQueries = deps.accountQueries;
        this.authorizationService = deps.authorizationService;
        this.printer = deps.printer;
    }

    public async getStatement(
        accountId: string,
        userId: string,
        options: GetStatementOptions
    ): Promise<CursorPaginatedResult<Transaction>> {
        await this.authorizationService.canAccessAccount(userId, accountId);
        return this.accountQueries.getStatement(accountId, options);
    }

    public async print(accountId: string, userId: string): Promise<void> {
        await this.authorizationService.canAccessAccount(userId, accountId);

        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new AccountError(`Account ${accountId} not found`);
        }

        account.printStatement();
    }

    public async export(
        accountId: string,
        format: StatementFormat,
        userId: string
    ): Promise<string> {
        await this.authorizationService.canAccessAccount(userId, accountId);

        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new AccountError(`Account ${accountId} not found`);
        }

        const result = await this.accountQueries.getStatement(accountId, { limit: 1000 });
        const transactions = result.items;

        switch (format) {
            case 'json':
                return JSON.stringify({
                    accountId,
                    transactions: transactions.map(tx => ({
                        date: tx.date.toISOString(),
                        amount: tx.amount.toFixed(2),
                        balance: tx.balance.toFixed(2),
                    })),
                }, null, 2);

            case 'csv': {
                const header = 'Date,Amount,Balance\n';
                const rows = transactions
                    .map(tx =>
                        `${tx.date.toISOString()},${tx.amount.toFixed(2)},${tx.balance.toFixed(2)}`
                    )
                    .join('\n');
                return header + rows;
            }

            case 'pdf':
                return `PDF export not yet implemented for account ${accountId}`;

            default:
                throw new AccountError(`Unsupported format: ${format}`);
        }
    }
}
