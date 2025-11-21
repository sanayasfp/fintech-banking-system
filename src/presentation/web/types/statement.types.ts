import type { Static } from '@sinclair/typebox';
import {
    getStatementSchema,
    printStatementSchema,
    exportStatementSchema,
} from '../schemas/statement.schema';

export type StatementIdParams = Static<typeof getStatementSchema.params>;

export type GetStatementQuery = Static<typeof getStatementSchema.querystring>;
export type ExportStatementQuery = Static<typeof exportStatementSchema.querystring>;

export type StatementResponse = Static<typeof getStatementSchema.response[200]>;
export type PrintStatementResponse = Static<typeof printStatementSchema.response[200]>;
