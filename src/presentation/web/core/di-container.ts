import { asClass, asValue, type AwilixContainer, Lifetime } from 'awilix';
import type { IAccountService } from '../../../application/services/IAccountService';
import type { IAuthService } from '../../../application/services/IAuthService';
import type { IStatementService } from '../../../application/services/IStatementService';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { IAuthorizationService } from '../../../domain/services/IAuthorizationService';
import type { IClock } from '../../../domain/services/IClock';

import { PrismaClient } from '@prisma/client';
import type { IAccountQueries } from '../../../application/queries/IAccountQueries';
import { AccountService } from '../../../application/services/AccountService';
import { AuthService } from '../../../application/services/AuthService';
import { StatementService } from '../../../application/services/StatementService';
import type { IAccountRepository } from '../../../domain';
import { AccountAggregate } from '../../../domain/entities/AccountAggregate';
import { PrismaAccountRepository } from '../../../infrastructure/persistence/PrismaAccountRepository';
import { PrismaUserRepository } from '../../../infrastructure/persistence/PrismaUserRepository';
import { SystemClock } from '../../../infrastructure/providers/SystemClock';
import { PrismaAccountQueries } from '../../../infrastructure/queries/PrismaAccountQueries';
import { AuthorizationService } from '../../domain/services/AuthorizationService';
import { ConsoleStatementPrinter } from '../../printers/ConsoleStatementPrinter';
import type { IStatementPrinter } from '../../printers/IStatementPrinter';
import { prisma } from './prisma-client';

declare module '@fastify/awilix' {
    interface Cradle {
        // Infrastructure
        clock: IClock;
        printer: IStatementPrinter;
        prisma: PrismaClient;

        // Repositories & Queries
        accountRepository: IAccountRepository;
        accountQueries: IAccountQueries;
        userRepository: IUserRepository;

        // Domain Services
        authorizationService: IAuthorizationService;

        // Application Services
        accountService: IAccountService;
        authService: IAuthService;
        statementService: IStatementService;

        // Factories
        accountFactory: typeof AccountAggregate.create;
    }

    interface RequestCradle {
        currentUserId?: string;
    }
}

export const registerDependencies = (diContainer: AwilixContainer) => {
    diContainer.register({
        // Infrastructure
        clock: asClass(SystemClock, {
            lifetime: Lifetime.SINGLETON,
        }),
        printer: asClass(ConsoleStatementPrinter, {
            lifetime: Lifetime.SINGLETON,
        }),
        prisma: asValue(prisma),

        // Repositories & Queries
        accountRepository: asClass(PrismaAccountRepository, {
            lifetime: Lifetime.SINGLETON,
        }),
        accountQueries: asClass(PrismaAccountQueries, {
            lifetime: Lifetime.SINGLETON,
        }),
        userRepository: asClass(PrismaUserRepository, {
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
        authService: asClass(AuthService, {
            lifetime: Lifetime.SINGLETON,
        }),
        statementService: asClass(StatementService, {
            lifetime: Lifetime.SINGLETON,
        }),

        accountFactory: asValue(AccountAggregate.create),
    });
};
