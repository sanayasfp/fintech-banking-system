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
import { authMiddleware } from '../middleware/auth.middleware';
import { controllerFactory } from '../utils/controllerFactory';

export const accountRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post(
        '/accounts',
        {
            schema: createAccountSchema,
            preHandler: authMiddleware,
        },
        controllerFactory(AccountController, 'createAccount', ['accountService']),
    );

    fastify.post(
        '/accounts/:id/deposit',
        {
            schema: depositSchema,
            preHandler: authMiddleware,
        },
        controllerFactory(AccountController, 'deposit', ['accountService']),
    );

    fastify.post(
        '/accounts/:id/withdraw',
        {
            schema: withdrawSchema,
            preHandler: authMiddleware,
        },
        controllerFactory(AccountController, 'withdraw', ['accountService']),
    );

    fastify.get(
        '/accounts/:id/balance',
        {
            schema: getBalanceSchema,
            preHandler: authMiddleware,
        },
        controllerFactory(AccountController, 'getBalance', ['accountService']),
    );

    fastify.get(
        '/accounts',
        {
            schema: listAccountsSchema,
            preHandler: authMiddleware,
        },
        controllerFactory(AccountController, 'listAccounts', ['accountService']),
    );

    fastify.delete(
        '/accounts/:id',
        {
            schema: closeAccountSchema,
            preHandler: authMiddleware,
        },
        controllerFactory(AccountController, 'closeAccount', ['accountService']),
    );
};
