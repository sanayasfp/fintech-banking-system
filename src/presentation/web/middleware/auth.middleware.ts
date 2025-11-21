import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../../../application/errors/UnauthorizedError';

export async function authMiddleware(
    request: FastifyRequest,
    _reply: FastifyReply
): Promise<void> {
    try {
        const authHeader = request.headers.authorization;
        const authService = request.diScope.resolve('authService');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError("Authorization header missing or malformed");
        }

        const token = authHeader.substring(7);

        const isValid = await authService.validateToken(token);

        if (!isValid) {
            throw new UnauthorizedError("Invalid token");
        }

        request.diScope.register({
            currentUserId: {
                resolve: () => token,
            },
        });
    } catch (error) {
        request.log.error(error);
        throw new UnauthorizedError("Authentication failed");
    }
}
