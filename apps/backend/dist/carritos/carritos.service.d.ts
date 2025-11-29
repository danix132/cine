import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class CarritosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCarritoDto: CreateCarritoDto, userId?: string, vendedorId?: string): Promise<{
        items: {
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            id: string;
            createdAt: Date;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        }[];
        usuario: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            rol: import("@prisma/client").$Enums.UserRole;
            generosPreferidos: string | null;
        };
        vendedor: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            rol: import("@prisma/client").$Enums.UserRole;
            generosPreferidos: string | null;
        };
    } & {
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        expiracion: Date;
    }>;
    findAll(query: any): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        items: ({
            carrito: {
                tipo: import("@prisma/client").$Enums.CarritoTipo;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                usuarioId: string | null;
                vendedorId: string | null;
                expiracion: Date;
            };
        } & {
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            id: string;
            createdAt: Date;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        })[];
        usuario: {
            nombre: string;
            id: string;
            email: string;
        };
        vendedor: {
            nombre: string;
            id: string;
            email: string;
        };
    } & {
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        expiracion: Date;
    }>>;
    findOne(id: string, userId?: string, vendedorId?: string): Promise<{
        items: {
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            id: string;
            createdAt: Date;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        }[];
        usuario: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            rol: import("@prisma/client").$Enums.UserRole;
            generosPreferidos: string | null;
        };
        vendedor: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            rol: import("@prisma/client").$Enums.UserRole;
            generosPreferidos: string | null;
        };
    } & {
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        expiracion: Date;
    }>;
    addItem(id: string, addItemDto: AddItemDto, userId?: string, vendedorId?: string): Promise<{
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        id: string;
        createdAt: Date;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
        carritoId: string;
    }>;
    updateItem(id: string, itemId: string, updateItemDto: UpdateItemDto, userId?: string, vendedorId?: string): Promise<{
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        id: string;
        createdAt: Date;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
        carritoId: string;
    }>;
    removeItem(id: string, itemId: string, userId?: string, vendedorId?: string): Promise<{
        message: string;
    }>;
    remove(id: string, userId?: string, vendedorId?: string): Promise<{
        message: string;
    }>;
    getCarritoByUser(userId: string): Promise<{
        items: {
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            id: string;
            createdAt: Date;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        }[];
    } & {
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        expiracion: Date;
    }>;
    getCarritoByVendedor(vendedorId: string): Promise<{
        items: {
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            id: string;
            createdAt: Date;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        }[];
    } & {
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        expiracion: Date;
    }>;
    limpiarCarritosExpirados(): Promise<{
        message: string;
    }>;
    calcularTotal(carrito: any): number;
}
