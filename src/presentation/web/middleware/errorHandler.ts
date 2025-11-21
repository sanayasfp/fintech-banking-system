import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ApplicationError } from '../../../application/errors/ApplicationError';
import { UnauthorizedError } from '../../../application/errors/UnauthorizedError';
import { DomainError } from '../../../domain/errors/DomainError';
import { DuplicateAccountNumberError } from '../../../domain/errors/DuplicateAccountNumberError';
import { InsufficientFundsError } from '../../../domain/errors/InsufficientFundsError';
import { InvalidAmountError } from '../../../domain/errors/InvalidAmountError';
import { InfrastructureError } from '../../../infrastructure/errors/InfrastructureError';

interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
    timestamp: string;
    path?: string;
    details?: unknown;
}

export const errorHandler = async (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
    const timestamp = new Date().toISOString();
    const path = request.url;

    request.log.error({
        err: error,
        request: {
            method: request.method,
            url: request.url,
            params: request.params,
            query: request.query,
        },
    }, 'Request error');

    if (error.validation) {
        const response: ErrorResponse = {
            error: 'Validation Error',
            message: 'Request validation failed',
            statusCode: 400,
            timestamp,
            path,
            details: error.validation,
        };
        return reply.status(400).send(response);
    }

    if (error instanceof UnauthorizedError) {
        const response: ErrorResponse = {
            error: 'Unauthorized',
            message: error.message,
            statusCode: 401,
            timestamp,
            path,
        };
        return reply.status(401).send(response);
    }

    if (error instanceof InsufficientFundsError) {
        const response: ErrorResponse = {
            error: 'Insufficient Funds',
            message: error.message,
            statusCode: 422,
            timestamp,
            path,
        };
        return reply.status(422).send(response);
    }

    if (error instanceof InvalidAmountError) {
        const response: ErrorResponse = {
            error: 'Invalid Amount',
            message: error.message,
            statusCode: 422,
            timestamp,
            path,
        };
        return reply.status(422).send(response);
    }

    if (error instanceof DuplicateAccountNumberError) {
        const response: ErrorResponse = {
            error: 'Duplicate Account',
            message: error.message,
            statusCode: 409,
            timestamp,
            path,
        };
        return reply.status(409).send(response);
    }

    if (error instanceof DomainError) {
        const response: ErrorResponse = {
            error: 'Domain Error',
            message: error.message,
            statusCode: 422,
            timestamp,
            path,
        };
        return reply.status(422).send(response);
    }

    if (error instanceof ApplicationError) {
        const response: ErrorResponse = {
            error: 'Application Error',
            message: error.message,
            statusCode: 400,
            timestamp,
            path,
        };
        return reply.status(400).send(response);
    }

    if (error instanceof InfrastructureError) {
        const response: ErrorResponse = {
            error: 'Service Unavailable',
            message: 'A service error occurred',
            statusCode: 503,
            timestamp,
            path,
        };
        return reply.status(503).send(response);
    }

    if (error.statusCode) {
        const response: ErrorResponse = {
            error: error.name || 'Error',
            message: error.message,
            statusCode: error.statusCode,
            timestamp,
            path,
        };
        return reply.status(error.statusCode).send(response);
    }

    if (error.statusCode === 429) {
        const response: ErrorResponse = {
            error: 'Too Many Requests',
            message: 'Rate limit exceeded',
            statusCode: 429,
            timestamp,
            path,
        };
        return reply.status(429).send(response);
    }

    const response: ErrorResponse = {
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : error.message,
        statusCode: 500,
        timestamp,
        path,
    };

    return reply.status(500).send(response);
};
