import { PrismaClient } from '@prisma/client';
import type { GetStatementOptions } from '../../application';
import type { AccountListView, IAccountQueries } from '../../application/queries/IAccountQueries';
import type { CursorPaginatedResult, CursorPaginationOptions } from '../../application/queries/Pagination';
import type { AccountStatus } from '../../domain';
import { AccountError } from '../../domain/errors/AccountError';
import type { IClock } from '../../domain/services/IClock';
import { Money } from '../../domain/value-objects/Money';
import { Transaction } from '../../domain/value-objects/Transaction';

export interface PrismaAccountQueriesDeps {
    prisma: PrismaClient;
    clock: IClock;
}

export class PrismaAccountQueries implements IAccountQueries {
    private readonly prisma: PrismaClient;
    private readonly clock: IClock;

    constructor({ prisma, clock }: PrismaAccountQueriesDeps) {
        this.prisma = prisma;
        this.clock = clock;
    }

    public async getBalance(accountId: string): Promise<Money> {
        const account = await this.prisma.account.findUnique({
            where: { id: accountId },
            select: { balance: true },
        });

        if (!account) {
            throw new AccountError(`Account with ID ${accountId} not found`);
        }

        return Money.from(account.balance.toString());
    }

    public async getStatement(
        accountId: string,
        options: GetStatementOptions
    ): Promise<CursorPaginatedResult<Transaction>> {
        const sixMonthsAgo = new Date(this.clock.now());
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6, 1);
        sixMonthsAgo.setHours(0, 0, 0, 0);
        const defaultStartDate = sixMonthsAgo;
        const defaultEndDate = this.clock.now();
        const { limit = 1, cursor, startDate = defaultStartDate, endDate = defaultEndDate } = options;
        const take = Math.max(1, Math.min(100, limit)) + 1;

        const dbTransactions = await this.prisma.transaction.findMany({
            take: take,
            ...(cursor ? { cursor: { id: cursor } } : {}),
            skip: cursor ? 1 : 0,

            where: {
                accountId,
                date: { gte: startDate, lte: endDate },
            },
            orderBy: [
                { date: 'desc' },
                { id: 'desc' },
            ],
        });

        const hasMore = dbTransactions.length === take;
        const items = hasMore ? dbTransactions.slice(0, limit) : dbTransactions;
        const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

        const domainTransactions = items.map(
            (tx) => new Transaction(
                tx.date,
                Money.from(tx.amount.toString()),
                Money.from(tx.balance.toString()),
            )
        );

        return {
            items: domainTransactions,
            nextCursor,
            hasMore,
        };
    }

    public async listAccountsByUser(userId: string, options: CursorPaginationOptions): Promise<CursorPaginatedResult<AccountListView>> {
        const { limit, cursor } = options;
        const take = Math.max(1, Math.min(100, limit)) + 1;

        const dbAccounts = await this.prisma.account.findMany({
            take: take,
            ...(cursor ? { cursor: { id: cursor } } : {}),
            skip: cursor ? 1 : 0,

            where: { userId },
            select: {
                id: true,
                accountNumber: true,
                balance: true,
                status: true,
                createdAt: true,
            },

            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' },
            ],
        });

        const hasMore = dbAccounts.length === take;
        const items = hasMore ? dbAccounts.slice(0, limit) : dbAccounts;
        const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

        const accountListViews: AccountListView[] = items.map((account) => ({
            id: account.id,
            accountNumber: account.accountNumber,
            balance: Money.from(account.balance.toString()),
            status: account.status as AccountStatus,
            createdAt: account.createdAt,
        }));

        return {
            items: accountListViews,
            nextCursor,
            hasMore,
        };
    }
}
