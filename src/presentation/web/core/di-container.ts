import { asClass, type AwilixContainer, Lifetime } from 'awilix';
import type { IAccountService } from '../../../application/services/IAccountService';
import type { IStatementService } from '../../../application/services/IStatementService';
import type { IAccountWriteRepository } from '../../../domain/repositories/IAccountRepository';
import type { ITransactionQueryRepository } from '../../../domain/repositories/ITransactionQueryRepository';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { IAuthorizationService } from '../../../domain/services/IAuthorizationService';
import type { IClock } from '../../../domain/services/IClock';

import { AccountService } from '../../../application/services/AccountService';
import { PrismaAccountRepository } from '../../../infrastructure/persistence/PrismaAccountRepository';
import { SystemClock } from '../../../infrastructure/providers/SystemClock';
import { StatementService } from '../../application/services/StatementService';
import { AuthorizationService } from '../../domain/services/AuthorizationService';

declare module '@fastify/awilix' {
    interface Cradle {
        // Infrastructure
        systemClock: IClock;

        // Repositories
        accountRepository: IAccountWriteRepository;
        transactionQueryRepository: ITransactionQueryRepository;
        userRepository: IUserRepository;

        // Domain Services
        authorizationService: IAuthorizationService;

        // Application Services
        accountService: IAccountService;
        statementService: IStatementService;
    }

    interface RequestCradle {
        currentUserId?: string;
    }
}

export const registerDependencies = (diContainer: AwilixContainer) => {
    diContainer.register({
        // Infrastructure
        systemClock: asClass(SystemClock, {
            lifetime: Lifetime.SINGLETON,
        }),

        // Repositories
        accountRepository: asClass(PrismaAccountRepository, {
            lifetime: Lifetime.SINGLETON,
        }),

        // Domain Services
        authorizationService: asClass(AuthorizationService, {
            lifetime: Lifetime.SINGLETON,
        }),

        // Application Services
        accountService: asClass(AccountService, {
            lifetime: Lifetime.SINGLETON,
        }),
        statementService: asClass(StatementService, {
            lifetime: Lifetime.SINGLETON,
        }),
    });
};
