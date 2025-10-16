import { CarritosService } from './carritos.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class CarritosController {
    private readonly carritosService;
    constructor(carritosService: CarritosService);
    create(createCarritoDto: CreateCarritoDto, req: any): Promise<{
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
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
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
    getMyCarrito(req: any): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    addItem(id: string, addItemDto: AddItemDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        carritoId: string;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateItem(id: string, itemId: string, updateItemDto: UpdateItemDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        carritoId: string;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeItem(id: string, itemId: string, req: any): Promise<{
        message: string;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    calcularTotal(id: string, req: any): number;
}
