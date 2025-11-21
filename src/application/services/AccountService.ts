import type { IAuthorizationService } from "../../domain";
import { AccountAggregate } from "../../domain/entities/AccountAggregate";
import { type IAccountAggregate } from "../../domain/entities/IAccountAggregate";
import { AccountError } from "../../domain/errors/AccountError";
import { DuplicateAccountNumberError } from "../../domain/errors/DuplicateAccountNumberError";
import type { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import type { IClock } from "../../domain/services/IClock";
import { Money } from "../../domain/value-objects/Money";
import type { IStatementPrinter } from "../../presentation/printers/IStatementPrinter";
import type { AccountListView, IAccountQueries } from "../queries/IAccountQueries";
import type { CursorPaginatedResult, CursorPaginationOptions } from "../queries/Pagination";
import type { IAccountService } from "./IAccountService";


export interface AccountServiceDeps {
    readonly accountRepository: IAccountRepository,
    readonly accountQueries: IAccountQueries,
    readonly clock: IClock,
    readonly authorizationService: IAuthorizationService,
    readonly printer: IStatementPrinter,
}


export class AccountService implements IAccountService {
    private readonly accountRepository: IAccountRepository;
    private readonly accountQueries: IAccountQueries;
    private readonly authorizationService: IAuthorizationService;
    private readonly clock: IClock;
    private readonly printer: IStatementPrinter;

    constructor(debs: AccountServiceDeps) {
        this.accountRepository = debs.accountRepository;
        this.accountQueries = debs.accountQueries;
        this.clock = debs.clock;
        this.authorizationService = debs.authorizationService;
        this.printer = debs.printer;
    }

    public async createAccount(
        userId: string,
        accountNumber: string,
        initialBalance?: Money
    ): Promise<IAccountAggregate> {
        await this.authorizationService.canCreateAccount(userId);

        const existingAccount = await this.accountRepository.findByAccountNumber(accountNumber);
        if (existingAccount) {
            throw new DuplicateAccountNumberError(accountNumber);
        }

        const newAccount = AccountAggregate.create({
            userId,
            accountNumber,
            clock: this.clock,
            printer: this.printer,
        });

        if (initialBalance?.isPositive() && !initialBalance.isZero()) {
            newAccount.deposit(initialBalance);
        }

        try {
            await this.accountRepository.save(newAccount);
        } catch (error: unknown) {
            // Handle Prisma unique constraint violation for accountNumber
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
                throw new DuplicateAccountNumberError(accountNumber);
            }
            throw error;
        }

        return newAccount;
    }

    public async deposit(accountId: string, amount: Money, userId?: string): Promise<void> {
        await this.authorizationService.canDeposit(userId, accountId);

        const account = await this.accountRepository.findById(accountId);

        if (!account) {
            throw new AccountError(`Account ${accountId} not found`);
        }

        account.deposit(amount);
        await this.accountRepository.save(account);
    }

    public async withdraw(accountId: string, amount: Money, userId?: string): Promise<void> {
        await this.authorizationService.canWithdraw(userId, accountId);

        const account = await this.accountRepository.findById(accountId);

        if (!account) {
            throw new AccountError(`Account ${accountId} not found`);
        }

        account.withdraw(amount);
        await this.accountRepository.save(account);
    }

    public async getBalance(accountId: string, userId?: string): Promise<Money> {
        await this.authorizationService.canAccessAccount(userId, accountId);

        return this.accountQueries.getBalance(accountId);
    }

    public async listUserAccounts(userId: string, options: CursorPaginationOptions): Promise<CursorPaginatedResult<AccountListView>> {
        return this.accountQueries.listAccountsByUser(userId, options);
    }

    public async closeAccount(accountId: string, userId?: string): Promise<void> {
        await this.authorizationService.canCloseAccount(userId, accountId);

        const account = await this.accountRepository.findById(accountId);

        if (!account) {
            throw new AccountError(`Account ${accountId} not found`);
        }

        account.close();
        await this.accountRepository.save(account);
    }
}
