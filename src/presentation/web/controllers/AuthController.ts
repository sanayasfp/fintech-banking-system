import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IAuthService } from '../../../application/services/IAuthService';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth.types';
import { Controller } from './Controller';

export interface AuthControllerDeps {
    readonly authService: IAuthService;
}

export class AuthController extends Controller<AuthControllerDeps> {
    private readonly authService: IAuthService;

    constructor(deps: AuthControllerDeps) {
        super(deps);
        this.authService = deps.authService;
    }

    async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const { phone, password, name } = request.body as RegisterRequest;

        const result = await this.authService.register(phone, password, name);

        const response: RegisterResponse = {
            success: true,
            userId: result.userId,
            token: result.token,
        };

        return reply.code(201).send(response);
    }

    async login(request: FastifyRequest, _reply: FastifyReply): Promise<LoginResponse> {
        const { phone, password } = request.body as LoginRequest;

        const result = await this.authService.login(phone, password);

        return {
            success: true,
            userId: result.userId,
            token: result.token,
        };
    }
}
