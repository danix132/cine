import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferenciasDto } from './dto/update-preferencias.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    changeMyPassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    deleteMyAccount(req: any): Promise<{
        message: string;
    }>;
    updateMyPreferencias(req: any, updatePreferenciasDto: UpdatePreferenciasDto): Promise<{
        message: string;
        generosPreferidos: string;
    }>;
}
