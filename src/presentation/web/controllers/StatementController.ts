import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IStatementService } from '../../../application/services/IStatementService';
import type { ExportStatementQuery, GetStatementQuery, PrintStatementResponse, StatementIdParams, StatementResponse } from '../types/statement.types';
import { Controller } from './Controller';

export interface StatementControllerDeps {
    readonly statementService: IStatementService;
}

export class StatementController extends Controller<StatementControllerDeps> {
    private readonly statementService: IStatementService;

    constructor(deps: StatementControllerDeps) {
        super(deps);
        this.statementService = deps.statementService;
    }

    async getStatement(request: FastifyRequest, _reply: FastifyReply): Promise<StatementResponse> {
        const { id } = request.params as StatementIdParams;
        const _query = request.query as GetStatementQuery; // Currently unused, but can be utilized for filtering in the future
        const userId = request.diScope.resolve('currentUserId');

        const statement = await this.statementService.getStatement(id, userId);

        return {
            accountId: statement.accountId,
            generatedAt: statement.generatedAt.toISOString(),
            transactions: statement.transactions.map(tx => ({
                date: tx.date.toISOString(),
                amount: Number(tx.amount.toFixed(2)),
                balance: Number(tx.balance.toFixed(2)),
                type: tx.amount.isNegative() ? 'withdrawal' : 'deposit',
            })),
        };
    }

    async printStatement(request: FastifyRequest, _reply: FastifyReply): Promise<PrintStatementResponse> {
        const { id } = request.params as StatementIdParams;
        const userId = request.diScope.resolve('currentUserId');

        await this.statementService.print(id, userId);

        return { message: 'Statement printed to console' };
    }

    async exportStatement(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as StatementIdParams;
        const { format } = request.query as ExportStatementQuery;
        const userId = request.diScope.resolve('currentUserId');

        const exported = await this.statementService.export(id, format, userId);

        const contentTypes = {
            json: 'application/json',
            csv: 'text/csv',
            pdf: 'application/pdf',
        };

        reply
            .header('Content-Type', contentTypes[format])
            .header('Content-Disposition', `attachment; filename="statement-${id}.${format}"`)
            .send(exported);
    }
}
