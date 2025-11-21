import type { IAccountAggregate } from "../entities/IAccountAggregate";

export interface IAccountRepository {
    findById(id: string): Promise<IAccountAggregate | null>;
    findByAccountNumber(accountNumber: string): Promise<IAccountAggregate | null>;
    save(account: IAccountAggregate): Promise<void>;
}
