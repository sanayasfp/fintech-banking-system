import type { PrismaClient } from '@prisma/client';
import type { IUser } from '../../domain/entities/IUser';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';

export interface PrismaUserRepositoryDeps {
    prisma: PrismaClient;
}

export class PrismaUserRepository implements IUserRepository {
    private readonly prisma: PrismaClient;

    constructor({ prisma }: PrismaUserRepositoryDeps) {
        this.prisma = prisma;
    }

    async findById(userId: string): Promise<IUser | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        return user;
    }

    async findByPhone(phone: string): Promise<IUser | null> {
        const user = await this.prisma.user.findUnique({
            where: { phone },
        });

        return user;
    }

    async save(user: IUser): Promise<void> {
        await this.prisma.user.upsert({
            where: { id: user.id },
            update: {
                phone: user.phone,
                password: user.password,
                name: user.name,
                updatedAt: new Date(),
            },
            create: {
                id: user.id,
                phone: user.phone,
                password: user.password,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }

    async delete(userId: string): Promise<void> {
        await this.prisma.user.delete({
            where: { id: userId },
        });
    }
}
