export interface IUser {
    id: string;
    phone: string;
    password: string;
    name?: string;
    createdAt: Date;
}

export interface CreateUserData {
    id: string;
    phone: string;
    password: string;
    name?: string;
}
