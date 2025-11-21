import type { IUser } from "../entities/IUser";

export interface IUserRepository {
    findById(userId: string): Promise<IUser | null>;
    findByPhone(phone: string): Promise<IUser | null>;
    save(user: IUser): Promise<void>;
    delete(userId: string): Promise<void>;
}
