import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../../../application/errors/UnauthorizedError';
import type { GetStatementOptions, IStatementService } from '../../../application/services/IStatementService';
import type { IClock } from '../../../domain/services/IClock';
import type { ExportStatementQuery, GetStatementQuery, PrintStatementResponse, StatementIdParams, StatementResponse } from '../types/statement.types';
import { Controller } from './Controller';

export interface StatementControllerDeps {
    readonly statementService: IStatementService;
    readonly clock: IClock;
}

export class StatementController extends Controller<StatementControllerDeps> {
    private readonly statementService: IStatementService;
    private readonly clock: IClock = this.deps.clock;

    constructor(deps: StatementControllerDeps) {
        super(deps);
        this.statementService = deps.statementService;
        this.clock = deps.clock;
    }

    async getStatement(request: FastifyRequest, _reply: FastifyReply): Promise<StatementResponse> {
        const { id } = request.params as StatementIdParams;
        const query = request.query as GetStatementQuery;
        const userId = request.diScope.resolve('currentUserId');

        if (userId == null) {
            throw new UnauthorizedError();
        }

        const options: GetStatementOptions = {
            limit: query.limit || 50,
            ...(query.cursor && { cursor: query.cursor }),
            ...(query.startDate && { startDate: new Date(query.startDate) }),
            ...(query.endDate && { endDate: new Date(query.endDate) }),
        };
        const result = await this.statementService.getStatement(id, userId, options);

        return {
            accountId: id,
            generatedAt: this.clock.now().toISOString().split('T')[0]!,
            transactions: result.items.map(tx => ({
                date: tx.date.toISOString(),
                amount: Number(tx.amount.toFixed(2)),
                balance: Number(tx.balance.toFixed(2)),
                type: tx.amount.isNegative() ? 'withdrawal' : 'deposit',
            })),
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
        };
    }

    async printStatement(request: FastifyRequest, _reply: FastifyReply): Promise<PrintStatementResponse> {
        const { id } = request.params as StatementIdParams;
        const userId = request.diScope.resolve('currentUserId');

        if (userId == null) {
            throw new UnauthorizedError();
        }

        await this.statementService.print(id, userId);

        return { message: 'Statement printed to console' };
    }

    async exportStatement(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as StatementIdParams;
        const { format } = request.query as ExportStatementQuery;
        const userId = request.diScope.resolve('currentUserId');

        if (userId == null) {
            throw new UnauthorizedError();
        }

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
