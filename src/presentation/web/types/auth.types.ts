import type { Static } from '@sinclair/typebox';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

export type RegisterRequest = Static<typeof registerSchema.body>;
export type LoginRequest = Static<typeof loginSchema.body>;

export type RegisterResponse = Static<typeof registerSchema.response[201]>;
export type LoginResponse = Static<typeof loginSchema.response[200]>;
