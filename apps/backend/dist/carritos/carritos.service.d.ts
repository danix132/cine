import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class CarritosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCarritoDto: CreateCarritoDto, userId?: string, vendedorId?: string): Promise<{
        usuario: {
            id: string;
            nombre: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            rol: import("@prisma/client").$Enums.UserRole;
        };
        vendedor: {
            id: string;
            nombre: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            rol: import("@prisma/client").$Enums.UserRole;
        };
        items: {
            id: string;
            createdAt: Date;
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            carritoId: string;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
        vendedorId: string | null;
    }>;
    findAll(query: any): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        usuario: {
            id: string;
            nombre: string;
            email: string;
        };
        vendedor: {
            id: string;
            nombre: string;
            email: string;
        };
        items: ({
            carrito: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                usuarioId: string | null;
                tipo: import("@prisma/client").$Enums.CarritoTipo;
                expiracion: Date;
                vendedorId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            carritoId: string;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
        vendedorId: string | null;
    }>>;
    findOne(id: string, userId?: string, vendedorId?: string): Promise<{
        usuario: {
            id: string;
            nombre: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            rol: import("@prisma/client").$Enums.UserRole;
        };
        vendedor: {
            id: string;
            nombre: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            rol: import("@prisma/client").$Enums.UserRole;
        };
        items: {
            id: string;
            createdAt: Date;
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            carritoId: string;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
        vendedorId: string | null;
    }>;
    addItem(id: string, addItemDto: AddItemDto, userId?: string, vendedorId?: string): Promise<{
        id: string;
        createdAt: Date;
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        carritoId: string;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateItem(id: string, itemId: string, updateItemDto: UpdateItemDto, userId?: string, vendedorId?: string): Promise<{
        id: string;
        createdAt: Date;
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        carritoId: string;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
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
            carritoId: string;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
        vendedorId: string | null;
    }>;
    getCarritoByVendedor(vendedorId: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            tipo: import("@prisma/client").$Enums.CarritoItemTipo;
            carritoId: string;
            referenciaId: string;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        tipo: import("@prisma/client").$Enums.CarritoTipo;
        expiracion: Date;
        vendedorId: string | null;
    }>;
    limpiarCarritosExpirados(): Promise<{
        message: string;
    }>;
    calcularTotal(carrito: any): number;
}
