import { PrismaClient, TransactionType } from '@prisma/client';
import { Money } from '../../domain/value-objects/Money';
import { Transaction } from '../../domain/value-objects/Transaction';

import type { Account as DbAccount, Transaction as DbTransaction } from '@prisma/client';
import type { AccountStatus, IAccountAggregate, IAccountFactoryFunc } from '../../domain';
import type { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import type { IClock } from '../../domain/services/IClock';
import type { IStatementPrinter } from '../../presentation/printers/IStatementPrinter';

export interface PrismaAccountRepositoryDeps {
    prisma: PrismaClient;
    accountFactory: IAccountFactoryFunc;
    clock: IClock;
    printer: IStatementPrinter;
}


export class PrismaAccountRepository implements IAccountRepository {
    private readonly prisma: PrismaClient;
    private readonly accountFactory: IAccountFactoryFunc;
    private readonly clock: IClock;
    private readonly printer: IStatementPrinter;

    constructor({ prisma, accountFactory, clock, printer }: PrismaAccountRepositoryDeps) {
        this.prisma = prisma;
        this.accountFactory = accountFactory;
        this.clock = clock;
        this.printer = printer;
    }

    public async findById(id: string): Promise<IAccountAggregate | null> {
        const dbAccount = await this.prisma.account.findUnique({
            where: { id },
            include: { transactions: { orderBy: { date: 'asc' } } },
        });

        if (!dbAccount) {
            return null;
        }

        return this.reconstitute(dbAccount, dbAccount.transactions);
    }

    public async findByAccountNumber(accountNumber: string): Promise<IAccountAggregate | null> {
        const dbAccount = await this.prisma.account.findUnique({
            where: { accountNumber },
            include: { transactions: { orderBy: { date: 'asc' } } },
        });

        if (!dbAccount) {
            return null;
        }

        return this.reconstitute(dbAccount, dbAccount.transactions);
    }

    public async save(account: IAccountAggregate): Promise<void> {
        const accountDataForDb = {
            id: account.id,
            userId: account.userId,
            accountNumber: account.accountNumber,
            status: account.getStatus(),
            balance: account.getBalance().toFixed(2),
            createdAt: account.createdAt,
        };

        const newTransactionsForDb = account.getNewTransactions().map(tx => ({
            accountId: account.id,
            amount: tx.amount.toFixed(2),
            balance: tx.balance.toFixed(2),
            date: tx.date,
            type: tx.amount.isPositive() ? TransactionType.DEPOSIT : TransactionType.WITHDRAWAL,
        }));

        await this.prisma.$transaction(async (tx) => {
            await tx.account.upsert({
                where: { id: account.id },
                update: accountDataForDb,
                create: accountDataForDb,
            });

            if (newTransactionsForDb.length > 0) {
                await tx.transaction.createMany({
                    data: newTransactionsForDb,
                });
            }
        });

        account.clearNewTransactions();
    }

    private reconstitute(dbAccount: DbAccount, dbTransactions: DbTransaction[]): IAccountAggregate {
        const domainTransactions = dbTransactions.map(
            (tx) => new Transaction(
                tx.date,
                Money.from(tx.amount.toString()),
                Money.from(tx.balance.toString()),
            )
        );

        return this.accountFactory({
            id: dbAccount.id,
            userId: dbAccount.userId,
            accountNumber: dbAccount.accountNumber,
            status: dbAccount.status as AccountStatus,
            createdAt: dbAccount.createdAt,
            balance: Money.from(dbAccount.balance.toString()),
            transactions: domainTransactions,
            printer: this.printer,
            clock: this.clock,
        });
    }
}
