import { DulceriaService } from './dulceria.service';
import { CreateDulceriaItemDto } from './dto/create-dulceria-item.dto';
import { UpdateDulceriaItemDto } from './dto/update-dulceria-item.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class DulceriaController {
    private readonly dulceriaService;
    constructor(dulceriaService: DulceriaService);
    create(createDulceriaItemDto: CreateDulceriaItemDto): Promise<{
        id: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        nombre: string;
        imagenUrl: string | null;
        activo: boolean;
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        _count: {
            movimientos: number;
        };
    } & {
        id: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        nombre: string;
        imagenUrl: string | null;
        activo: boolean;
    }>>;
    findActive(): Promise<{
        id: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        nombre: string;
        imagenUrl: string | null;
        activo: boolean;
    }[]>;
    findByTipo(tipo: string): Promise<{
        id: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        nombre: string;
        imagenUrl: string | null;
        activo: boolean;
    }[]>;
    obtenerInventario(): Promise<{
        stock: number;
        _count: {
            movimientos: number;
        };
        id: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        nombre: string;
        imagenUrl: string | null;
        activo: boolean;
    }[]>;
    procesarVenta(procesarVentaDulceriaDto: any, req: any): Promise<{
        success: boolean;
        pedido: {
            items: {
                producto: {
                    id: string;
                    nombre: string;
                    tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
                };
                id: string;
                tipo: import("@prisma/client").$Enums.PedidoItemTipo;
                createdAt: Date;
                referenciaId: string;
                descripcion: string | null;
                cantidad: number;
                precio: import("@prisma/client/runtime/library").Decimal;
                precioUnitario: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                pedidoId: string;
            }[];
            vendedor: {
                id: string;
                nombre: string;
                email: string;
            };
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            tipo: import("@prisma/client").$Enums.PedidoTipo;
            estado: import("@prisma/client").$Enums.PedidoEstado;
            metodoPago: string | null;
            createdAt: Date;
            updatedAt: Date;
            usuarioId: string | null;
            vendedorId: string | null;
        };
        message: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        nombre: string;
        imagenUrl: string | null;
        activo: boolean;
    }>;
    update(id: string, updateDulceriaItemDto: UpdateDulceriaItemDto): Promise<{
        id: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        nombre: string;
        imagenUrl: string | null;
        activo: boolean;
    }>;
    activar(id: string): Promise<{
        message: string;
        dulceriaItem: {
            id: string;
            tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
            createdAt: Date;
            updatedAt: Date;
            descripcion: string | null;
            precio: import("@prisma/client/runtime/library").Decimal;
            nombre: string;
            imagenUrl: string | null;
            activo: boolean;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        dulceriaItem: {
            id: string;
            tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
            createdAt: Date;
            updatedAt: Date;
            descripcion: string | null;
            precio: import("@prisma/client/runtime/library").Decimal;
            nombre: string;
            imagenUrl: string | null;
            activo: boolean;
        };
    }>;
}
