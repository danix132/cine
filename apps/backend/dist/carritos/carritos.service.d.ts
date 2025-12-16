import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class CarritosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCarritoDto: CreateCarritoDto, userId?: string, vendedorId?: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        }[];
        usuario: {
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.UserRole;
            generosPreferidos: string | null;
            id: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
        };
        vendedor: {
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.UserRole;
            generosPreferidos: string | null;
            id: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
    }>;
    findAll(query: any): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        items: ({
            carrito: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                usuarioId: string | null;
                vendedorId: string | null;
                tipo: import("@prisma/client").$Enums.CarritoTipo;
                expiracion: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        })[];
        usuario: {
            nombre: string;
            email: string;
            id: string;
        };
        vendedor: {
            nombre: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
    }>>;
    findOne(id: string, userId?: string, vendedorId?: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        }[];
        usuario: {
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.UserRole;
            generosPreferidos: string | null;
            id: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
        };
        vendedor: {
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.UserRole;
            generosPreferidos: string | null;
            id: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
    }>;
    addItem(id: string, addItemDto: AddItemDto, userId?: string, vendedorId?: string): Promise<{
        id: string;
        createdAt: Date;
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
        carritoId: string;
    }>;
    updateItem(id: string, itemId: string, updateItemDto: UpdateItemDto, userId?: string, vendedorId?: string): Promise<{
        id: string;
        createdAt: Date;
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
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
            id: string;
            createdAt: Date;
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
    }>;
    getCarritoByVendedor(vendedorId: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            carritoId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
    }>;
    limpiarCarritosExpirados(): Promise<{
        message: string;
    }>;
    calcularTotal(carrito: any): number;
}
