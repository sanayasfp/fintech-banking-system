import type { Static } from '@sinclair/typebox';
import {
    getStatementSchema,
    printStatementSchema,
    exportStatementSchema,
} from '../schemas/statement.schema';

// Params types
export type StatementIdParams = Static<typeof getStatementSchema.params>;

// Query types
export type GetStatementQuery = Static<typeof getStatementSchema.querystring>;
export type ExportStatementQuery = Static<typeof exportStatementSchema.querystring>;

// Response types
export type StatementResponse = Static<typeof getStatementSchema.response[200]>;
export type PrintStatementResponse = Static<typeof printStatementSchema.response[200]>;
