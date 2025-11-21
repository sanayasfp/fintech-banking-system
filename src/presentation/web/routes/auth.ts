import type { FastifyPluginAsync } from 'fastify';
import { AuthController } from '../controllers/AuthController';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { controllerFactory } from '../utils/controllerFactory';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post(
        '/auth/register',
        { schema: registerSchema },
        controllerFactory(AuthController, 'register', ['authService']),
    );

    fastify.post(
        '/auth/login',
        { schema: loginSchema },
        controllerFactory(AuthController, 'login', ['authService']),
    );
};
