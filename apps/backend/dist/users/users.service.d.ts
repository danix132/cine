import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        nombre: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        rol: import("@prisma/client").$Enums.UserRole;
    }>;
    findAll(query: any): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        nombre: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            boletos: number;
            carritos: number;
            pedidos: number;
        };
        email: string;
        rol: import("@prisma/client").$Enums.UserRole;
    }>>;
    findOne(id: string): Promise<{
        nombre: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        rol: import("@prisma/client").$Enums.UserRole;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        nombre: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        rol: import("@prisma/client").$Enums.UserRole;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByEmail(email: string): Promise<{
        nombre: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        rol: import("@prisma/client").$Enums.UserRole;
        generosPreferidos: string | null;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    updatePreferencias(userId: string, generosPreferidos: string): Promise<{
        message: string;
        generosPreferidos: string;
    }>;
}
