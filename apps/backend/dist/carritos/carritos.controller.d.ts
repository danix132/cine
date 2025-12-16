import { CarritosService } from './carritos.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class CarritosController {
    private readonly carritosService;
    constructor(carritosService: CarritosService);
    create(createCarritoDto: CreateCarritoDto, req: any): Promise<{
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
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
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
    getMyCarrito(req: any): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    addItem(id: string, addItemDto: AddItemDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
        carritoId: string;
    }>;
    updateItem(id: string, itemId: string, updateItemDto: UpdateItemDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
        carritoId: string;
    }>;
    removeItem(id: string, itemId: string, req: any): Promise<{
        message: string;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    calcularTotal(id: string, req: any): number;
}
