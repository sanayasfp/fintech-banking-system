export interface IAuthService {
    register(phone: string, password: string, name?: string): Promise<AuthResult>;
    login(phone: string, password: string): Promise<AuthResult>;
    validateToken(token: string): Promise<string | null>;
}

export interface AuthResult {
    userId: string;
    token: string;
}
