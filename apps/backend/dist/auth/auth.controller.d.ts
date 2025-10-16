import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): any;
}
