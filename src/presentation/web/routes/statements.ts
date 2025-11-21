import type { FastifyPluginAsync } from 'fastify';
import { StatementController } from '../controllers/StatementController';
import { controllerFactory } from '../utils/controllerFactory';
import {
    getStatementSchema,
    printStatementSchema,
    exportStatementSchema,
} from '../schemas/statement.schema';
import { authMiddleware } from '../middleware/auth.middleware';

export const statementRoutes: FastifyPluginAsync = async (fastify) => {

    fastify.get(
        '/accounts/:id/statement',
        { 
            schema: getStatementSchema,
            preHandler: authMiddleware,
        },
        controllerFactory(StatementController, 'getStatement', ['statementService', 'clock']),
    );

    fastify.post(
        '/accounts/:id/statement/print',
        { 
            schema: printStatementSchema,
            preHandler: authMiddleware,
        },
        controllerFactory(StatementController, 'printStatement', ['statementService', 'clock']),
    );

    fastify.get(
        '/accounts/:id/statement/export',
        { 
            schema: exportStatementSchema,
            preHandler: authMiddleware,
        },
        controllerFactory(StatementController, 'exportStatement', ['statementService', 'clock']),
    );
};
