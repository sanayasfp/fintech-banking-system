import { ulid } from 'ulidx';
import type { IUser } from '../../domain/entities/IUser';
import { AccountError } from '../../domain/errors/AccountError';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IClock } from '../../domain/services/IClock';
import type { AuthResult, IAuthService } from './IAuthService';

export interface AuthServiceDeps {
    readonly userRepository: IUserRepository;
    readonly clock: IClock;
}

export class AuthService implements IAuthService {
    private readonly userRepository: IUserRepository;
    private readonly clock: IClock;

    constructor(deps: AuthServiceDeps) {
        this.userRepository = deps.userRepository;
        this.clock = deps.clock;
    }

    async register(phone: string, password: string, name?: string): Promise<AuthResult> {
        const existingUser = await this.userRepository.findByPhone(phone);
        if (existingUser) {
            throw new AccountError('User with this phone already exists');
        }

        // const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password; // TODO: Implement proper password hashing

        const userId = ulid();

        const newUser: IUser = {
            id: userId,
            phone,
            password: hashedPassword,
            name: name || '',
            createdAt: this.clock.now(),
            updatedAt: this.clock.now(),
        };

        await this.userRepository.save(newUser);

        // const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const token = userId; // TODO: Implement proper JWT

        return { userId, token };
    }

    async login(phone: string, password: string): Promise<AuthResult> {
        const user = await this.userRepository.findByPhone(phone);

        if (!user) {
            throw new AccountError('Invalid phone or password');
        }

        // const isValid = await bcrypt.compare(password, user.password);
        const isValid = password === user.password; // TODO: Implement proper password verification

        if (!isValid) {
            throw new AccountError('Invalid phone or password');
        }

        // In production, generate a proper JWT token
        const token = user.id; // TODO: Implement proper JWT

        return { userId: user.id, token };
    }

    async validateToken(token: string): Promise<string | null> {
        // For now, treat token as userId
        const user = await this.userRepository.findById(token);
        return user ? user.id : null;
    }
}
