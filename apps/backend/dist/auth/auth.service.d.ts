import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private usersService;
    private jwtService;
    constructor(prisma: PrismaService, usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.UserRole;
            id: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        token: string;
    }>;
    validateUser(id: string): Promise<{
        email: string;
        nombre: string;
        rol: import("@prisma/client").$Enums.UserRole;
        id: string;
        createdAt: Date;
    }>;
}
