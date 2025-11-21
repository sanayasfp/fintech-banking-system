import { Type } from '@sinclair/typebox';
import { UlidType } from '../types/ulid.types';
import { CursorPaginatedResultSchema, PaginationLimitSchema } from './pagination.schema';

export const createAccountSchema = {
    tags: ['accounts'],
    description: 'Create a new bank account',
    body: Type.Object({
        userId: UlidType(),
        accountNumber: Type.String({ minLength: 10, maxLength: 20 }),
        initialBalance: Type.Optional(
            Type.Number({ minimum: 0, description: 'Initial balance in cents' }),
        ),
    }),
    response: {
        201: Type.Object({
            accountId: UlidType(),
            success: Type.Boolean(),
        }),
    },
} as const;

export const depositSchema = {
    tags: ['accounts'],
    description: 'Deposit money into an account',
    params: Type.Object({
        id: UlidType(),
    }),
    body: Type.Object({
        amount: Type.Number({ minimum: 0.01, description: 'Amount in cents' }),
    }),
    response: {
        200: Type.Object({
            success: Type.Boolean(),
            newBalance: Type.Number(),
        }),
    },
} as const;

export const withdrawSchema = {
    tags: ['accounts'],
    description: 'Withdraw money from an account',
    params: Type.Object({
        id: UlidType(),
    }),
    body: Type.Object({
        amount: Type.Number({ minimum: 0.01, description: 'Amount in cents' }),
    }),
    response: {
        200: Type.Object({
            success: Type.Boolean(),
            newBalance: Type.Number(),
        }),
    },
} as const;

export const getBalanceSchema = {
    tags: ['accounts'],
    description: 'Get account balance',
    params: Type.Object({
        id: UlidType(),
    }),
    response: {
        200: Type.Object({
            accountId: Type.String(),
            balance: Type.Number(),
            currency: Type.String(),
        }),
    },
} as const;

export const listAccountsSchema = {
    tags: ['accounts'],
    description: 'List all accounts for current user',
    querystring: Type.Object({
        limit: PaginationLimitSchema(),
        cursor: Type.Optional(Type.String()),
    }),
    response: {
        200: CursorPaginatedResultSchema(
            Type.Object({
                accountId: Type.String(),
                accountNumber: Type.String(),
                balance: Type.Number(),
            })),
    },
} as const;

export const closeAccountSchema = {
    tags: ['accounts'],
    description: 'Close an account',
    params: Type.Object({
        id: UlidType(),
    }),
    response: {
        204: Type.Null(),
    },
} as const;
