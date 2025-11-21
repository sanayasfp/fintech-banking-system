import type { IAccountRepository, IAuthorizationService } from "../../../domain";

export interface AuthorizationServiceDeps {
    readonly accountRepository: IAccountRepository;
}

export class AuthorizationService implements IAuthorizationService {
    private readonly accountRepository: IAccountRepository;

    constructor(deps: AuthorizationServiceDeps) {
        this.accountRepository = deps.accountRepository;
    }

    async canAccessAccount(userId?: string, accountId?: string): Promise<boolean> {
        if (!userId || !accountId) {
            return false;
        }

        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            return false;
        }

        return account.userId === userId;
    }


    canDeposit(userId?: string, accountId?: string): Promise<boolean> {
        return this.canAccessAccount(userId, accountId);
    }

    canWithdraw(userId?: string, accountId?: string): Promise<boolean> {
        return this.canAccessAccount(userId, accountId);
    }

    canCreateAccount(userId?: string): Promise<boolean> {
        return Promise.resolve(!!userId);
    }

    canCloseAccount(userId?: string, accountId?: string): Promise<boolean> {
        return this.canAccessAccount(userId, accountId);
    }
}
