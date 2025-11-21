import { Type } from '@sinclair/typebox';
import { UlidType } from '../types/ulid.types';

export const registerSchema = {
    tags: ['auth'],
    description: 'Register a new user',
    body: Type.Object({
        phone: Type.String({ format: 'phone' }),
        password: Type.String({ minLength: 5 }),
        name: Type.Optional(Type.String({ minLength: 1 })),
    }),
    response: {
        201: Type.Object({
            success: Type.Boolean(),
            userId: UlidType(),
            token: Type.String(),
        }),
    },
} as const;

export const loginSchema = {
    tags: ['auth'],
    description: 'Login with phone and password',
    body: Type.Object({
        phone: Type.String({ format: 'phone' }),
        password: Type.String({ minLength: 1 }),
    }),
    response: {
        200: Type.Object({
            success: Type.Boolean(),
            userId: UlidType(),
            token: Type.String(),
        }),
    },
} as const;
