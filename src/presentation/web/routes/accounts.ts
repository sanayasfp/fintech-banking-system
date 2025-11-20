import type { FastifyPluginAsync } from 'fastify';
import { AccountController } from '../controllers/AccountController';
import {
    closeAccountSchema,
    createAccountSchema,
    depositSchema,
    getBalanceSchema,
    listAccountsSchema,
    withdrawSchema,
} from '../schemas/account.schema';
import { controllerFactory } from '../utils/controllerFactory';

export const accountRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post(
        '/accounts',
        { schema: createAccountSchema },
        controllerFactory(AccountController, 'createAccount', ['accountService']),
    );

    fastify.post(
        '/accounts/:id/deposit',
        { schema: depositSchema },
        controllerFactory(AccountController, 'deposit', ['accountService']),
    );

    fastify.post(
        '/accounts/:id/withdraw',
        { schema: withdrawSchema },
        controllerFactory(AccountController, 'withdraw', ['accountService']),
    );

    fastify.get(
        '/accounts/:id/balance',
        { schema: getBalanceSchema },
        controllerFactory(AccountController, 'getBalance', ['accountService']),
    );

    fastify.get(
        '/accounts',
        { schema: listAccountsSchema },
        controllerFactory(AccountController, 'listAccounts', ['accountService']),
    );

    fastify.delete(
        '/accounts/:id',
        { schema: closeAccountSchema },
        controllerFactory(AccountController, 'closeAccount', ['accountService']),
    );
};
