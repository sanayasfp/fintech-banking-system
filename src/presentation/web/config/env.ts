import { type Static, Type } from '@sinclair/typebox';

export const envSchema = Type.Object({
    NODE_ENV: Type.Union([
        Type.Literal('development'),
        Type.Literal('production'),
        Type.Literal('test'),
    ], { default: 'development' }),
    PORT: Type.Number({ default: 3000 }),
    HOST: Type.String({ default: '0.0.0.0' }),
    LOG_LEVEL: Type.Union([
        Type.Literal('fatal'),
        Type.Literal('error'),
        Type.Literal('warn'),
        Type.Literal('info'),
        Type.Literal('debug'),
        Type.Literal('trace'),
    ], { default: 'info' }),
    CORS_ORIGIN: Type.String({ default: '*' }),
    JWT_SECRET: Type.String(),
    JWT_EXPIRATION: Type.String({ default: '7d' }),
    RATE_LIMIT_MAX: Type.Number({ default: 100 }),
    RATE_LIMIT_TIME_WINDOW: Type.String({ default: '15 minutes' }),
});

export type EnvConfig = Static<typeof envSchema>;

declare module 'fastify' {
    interface FastifyInstance {
        config: EnvConfig;
    }
}
