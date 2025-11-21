import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IAccountService } from '../../../application/services/IAccountService';
import type { AccountIdParams, BalanceResponse, CreateAccountRequest, CreateAccountResponse, DepositRequest, ListAccountsResponse, TransactionResponse, WithdrawRequest } from '../types/account.types';
import { Controller } from './Controller';
import { Money } from '../../../domain/value-objects/Money';
import type { CursorPaginationOptions } from '../../../application/queries/Pagination';
import { UnauthorizedError } from '../../../application/errors/UnauthorizedError';

export interface AccountControllerDeps {
    readonly accountService: IAccountService;
}

export class AccountController extends Controller<AccountControllerDeps> {
    private readonly accountService: IAccountService;

    constructor(deps: AccountControllerDeps) {
        super(deps);
        this.accountService = deps.accountService;
    }

    async createAccount(request: FastifyRequest, reply: FastifyReply) {
        const { userId, accountNumber, initialBalance } = request.body as CreateAccountRequest;

        const account = await this.accountService.createAccount(
            userId,
            accountNumber,
            initialBalance ? Money.from(initialBalance) : Money.ZERO,
        );

        const response: CreateAccountResponse = {
            success: true,
            accountId: account.id,
        };

        return reply.code(201).send(response);
    }

    async deposit(request: FastifyRequest, _reply: FastifyReply): Promise<TransactionResponse> {
        const { id } = request.params as AccountIdParams;
        const { amount } = request.body as DepositRequest;
        const userId = request.diScope.resolve('currentUserId');

        await this.accountService.deposit(id, Money.from(amount), userId);

        return {
            success: true,
            newBalance: 0,
        };
    }

    async withdraw(request: FastifyRequest, _reply: FastifyReply): Promise<TransactionResponse> {
        const { id } = request.params as AccountIdParams;
        const { amount } = request.body as WithdrawRequest;
        const userId = request.diScope.resolve('currentUserId');

        await this.accountService.withdraw(id, Money.from(amount), userId);

        return { success: true, newBalance: 0 };
    }

    async getBalance(request: FastifyRequest, _reply: FastifyReply): Promise<BalanceResponse> {
        const { id } = request.params as AccountIdParams;
        const userId = request.diScope.resolve('currentUserId');
        const balance = await this.accountService.getBalance(id, userId);

        return {
            accountId: id,
            balance: Number(balance.toFixed(2)),
            currency: 'USD', // Will be dynamic in a real application
        };
    }

    async listAccounts(request: FastifyRequest, _reply: FastifyReply): Promise<ListAccountsResponse> {
        const userId = request.diScope.resolve('currentUserId');

        if (!userId) {
            throw new UnauthorizedError();
        }

        const query = request.query as { limit?: number; cursor?: string };
        const options: CursorPaginationOptions = {
            limit: query.limit ?? 20,
            ...(query.cursor ? { cursor: query.cursor } : {}),
        };
        const { items: accounts, ...pagination } = await this.accountService.listUserAccounts(userId, options);

        return {
            items: accounts.map(account => ({
                accountId: account.id,
                accountNumber: account.accountNumber,
                balance: Number(account.balance.toFixed(2)),
            })),
            ...pagination,
        }
    }

    async closeAccount(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as AccountIdParams;
        const userId = request.diScope.resolve('currentUserId');

        await this.accountService.closeAccount(id, userId);

        return reply.code(204).send();
    }
}
