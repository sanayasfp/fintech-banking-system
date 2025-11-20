import { Type } from '@sinclair/typebox';

export const getStatementSchema = {
    tags: ['statements'],
    description: 'Get account statement',
    params: Type.Object({
        id: Type.String({ format: 'uuid' }),
    }),
    querystring: Type.Object({
        startDate: Type.Optional(Type.String({ format: 'date' })),
        endDate: Type.Optional(Type.String({ format: 'date' })),
        limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    }),
    response: {
        200: Type.Object({
            accountId: Type.String(),
            generatedAt: Type.String({ format: 'date-time' }),
            transactions: Type.Array(
                Type.Object({
                    date: Type.String({ format: 'date-time' }),
                    amount: Type.Number(),
                    balance: Type.Number(),
                    type: Type.Union([Type.Literal('deposit'), Type.Literal('withdrawal')]),
                }),
            ),
        }),
    },
} as const;

export const printStatementSchema = {
    tags: ['statements'],
    description: 'Print statement to console (for testing)',
    params: Type.Object({
        id: Type.String({ format: 'uuid' }),
    }),
    response: {
        200: Type.Object({
            message: Type.String(),
        }),
    },
} as const;

export const exportStatementSchema = {
    tags: ['statements'],
    description: 'Export statement in different formats',
    params: Type.Object({
        id: Type.String({ format: 'uuid' }),
    }),
    querystring: Type.Object({
        format: Type.Union([
            Type.Literal('json'),
            Type.Literal('csv'),
            Type.Literal('pdf'),
        ]),
    }),
    response: {
        200: Type.String({ description: 'Statement in requested format' }),
    },
} as const;
