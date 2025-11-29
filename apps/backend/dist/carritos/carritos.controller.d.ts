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
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
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
    getMyCarrito(req: any): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    addItem(id: string, addItemDto: AddItemDto, req: any): Promise<{
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        id: string;
        createdAt: Date;
        referenciaId: string;
        cantidad: number;
        precioUnitario: import("@prisma/client/runtime/library").Decimal;
        carritoId: string;
    }>;
    updateItem(id: string, itemId: string, updateItemDto: UpdateItemDto, req: any): Promise<{
        tipo: import("@prisma/client").$Enums.CarritoItemTipo;
        id: string;
        createdAt: Date;
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
