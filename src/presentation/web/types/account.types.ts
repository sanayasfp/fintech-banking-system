import type { Static } from '@sinclair/typebox';
import {
    createAccountSchema,
    depositSchema,
    getBalanceSchema,
    listAccountsSchema,
    withdrawSchema,
} from '../schemas/account.schema';

export type CreateAccountRequest = Static<typeof createAccountSchema.body>;
export type DepositRequest = Static<typeof depositSchema.body>;
export type WithdrawRequest = Static<typeof withdrawSchema.body>;

export type AccountIdParams = Static<typeof depositSchema.params>;

export type CreateAccountResponse = Static<typeof createAccountSchema.response[201]>;
export type TransactionResponse = Static<typeof depositSchema.response[200]>;
export type BalanceResponse = Static<typeof getBalanceSchema.response[200]>;
export type ListAccountsResponse = Static<typeof listAccountsSchema.response[200]>;
