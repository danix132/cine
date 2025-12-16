import { UserRole } from '@prisma/client';
export declare class CreateUserDto {
    nombre: string;
    email: string;
    password: string;
    rol?: UserRole;
    generosPreferidos?: string;
}
