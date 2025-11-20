export interface IAuthorizationService {
    canAccessAccount(userId: string, accountId: string): Promise<boolean>;
    canDeposit(userId: string, accountId: string): Promise<boolean>;
    canWithdraw(userId: string, accountId: string): Promise<boolean>;
}
