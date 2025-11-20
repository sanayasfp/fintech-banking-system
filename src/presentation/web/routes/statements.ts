import type { FastifyPluginAsync } from 'fastify';
import { StatementController } from '../controllers/StatementController';
import { controllerFactory } from '../utils/controllerFactory';
import {
    getStatementSchema,
    printStatementSchema,
    exportStatementSchema,
} from '../schemas/statement.schema';

export const statementRoutes: FastifyPluginAsync = async (fastify) => {

    fastify.get(
        '/accounts/:id/statement',
        { schema: getStatementSchema },
        controllerFactory(StatementController, 'getStatement', ['statementService']),
    );

    fastify.post(
        '/accounts/:id/statement/print',
        { schema: printStatementSchema },
        controllerFactory(StatementController, 'printStatement', ['statementService']),
    );

    fastify.get(
        '/accounts/:id/statement/export',
        { schema: exportStatementSchema },
        controllerFactory(StatementController, 'exportStatement', ['statementService']),
    );
};
