import { fastifyAwilixPlugin } from '@fastify/awilix';
import cors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Ajv, { type ErrorObject } from 'ajv';
import Fastify, { type FastifySchema } from 'fastify';
import { envSchema, envToLogger } from './config';
import { dateFormat, dateTimeFormat } from './types/date.types';
import { emailFormat } from './types/email.types';
import { phoneFormat } from './types/phone.types';
import { ulidFormat } from './types/ulid.types';
import { registerCustomFormats } from './utils/formatValidator';
import { registerDependencies } from './core/di-container';
import { accountRoutes } from './routes/accounts';
import { authRoutes } from './routes/auth';
import { statementRoutes } from './routes/statements';
import { errorHandler } from './middleware/errorHandler';

export const buildApp = async () => {
    const app = Fastify({
        logger: envToLogger[(process.env.NODE_ENV || 'development') as keyof typeof envToLogger],
        ajv: {
            customOptions: {
                removeAdditional: 'all',
                coerceTypes: true,
                useDefaults: true,
            },
        },
    }).withTypeProvider<TypeBoxTypeProvider>();

    app.setValidatorCompiler(({ schema }: { schema: FastifySchema }) => {
        const ajv = new Ajv();

        registerCustomFormats(ajv, [ulidFormat, dateFormat, dateTimeFormat, emailFormat, phoneFormat]);

        const validate = ajv.compile(schema);

        return (data: unknown) => {
            const valid = validate(data);
            if (valid) {
                return { value: data };
            } else {
                return { value: data, error: validate.errors as ErrorObject[] };
            }
        };
    });

    await app.register(fastifyEnv, {
        confKey: 'config',
        schema: envSchema,
        dotenv: true,
    });

    await app.register(fastifyAwilixPlugin, {
        disposeOnClose: true,
        disposeOnResponse: true,
        strictBooleanEnforced: true,
    });

    registerDependencies(app.diContainer);

    await app.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
    });

    await app.register(cors, {
        origin: app.config.CORS_ORIGIN,
        credentials: true,
    });

    await app.register(rateLimit, {
        max: app.config.RATE_LIMIT_MAX,
        timeWindow: app.config.RATE_LIMIT_TIME_WINDOW,
    });

    await app.register(sensible);

    app.setErrorHandler(errorHandler);

    await app.register(swagger, {
        openapi: {
            info: {
                title: 'Fintech Banking System API',
                description: 'Banking system API with DDD and CQRS architecture',
                version: '1.0.0',
            },
            servers: [
                {
                    url: `http://localhost:${app.config.PORT}`,
                    description: 'Development server',
                },
            ],
            tags: [
                { name: 'accounts', description: 'Account management endpoints' },
                { name: 'statements', description: 'Statement generation endpoints' },
                { name: 'health', description: 'Health check endpoints' },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    }
                }
            },
            security: [{ bearerAuth: [] }],
        },
    });

    await app.register(swaggerUI, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: true,
        },
    });

    app.get('/health', {
        schema: {
            tags: ['health'],
            description: 'Health check endpoint',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        timestamp: { type: 'string' },
                    },
                },
            },
        },
    }, async () => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    });

    await app.register(authRoutes, { prefix: '/api/v1' });
    await app.register(accountRoutes, { prefix: '/api/v1' });
    await app.register(statementRoutes, { prefix: '/api/v1' });

    return app;
};
