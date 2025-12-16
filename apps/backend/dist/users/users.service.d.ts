import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: any): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            boletos: number;
            carritos: number;
            pedidos: number;
        };
    }>>;
    findOne(id: string): Promise<{
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByEmail(email: string): Promise<{
        nombre: string;
        email: string;
        rol: import("@prisma/client").$Enums.UserRole;
        generosPreferidos: string | null;
        id: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    updatePreferencias(userId: string, generosPreferidos: string): Promise<{
        message: string;
        generosPreferidos: string;
    }>;
}
