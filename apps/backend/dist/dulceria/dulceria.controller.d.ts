import { DulceriaService } from './dulceria.service';
import { CreateDulceriaItemDto } from './dto/create-dulceria-item.dto';
import { UpdateDulceriaItemDto } from './dto/update-dulceria-item.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class DulceriaController {
    private readonly dulceriaService;
    constructor(dulceriaService: DulceriaService);
    create(createDulceriaItemDto: CreateDulceriaItemDto): Promise<{
        id: string;
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        _count: {
            movimientos: number;
        };
    } & {
        id: string;
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findActive(): Promise<{
        id: string;
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByTipo(tipo: string): Promise<{
        id: string;
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    obtenerInventario(): Promise<{
        stock: number;
        _count: {
            movimientos: number;
        };
        id: string;
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
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
                descripcion: string | null;
                precio: import("@prisma/client/runtime/library").Decimal;
                createdAt: Date;
                pedidoId: string;
                referenciaId: string;
                cantidad: number;
                precioUnitario: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            }[];
            vendedor: {
                id: string;
                nombre: string;
                email: string;
            };
            id: string;
            tipo: import("@prisma/client").$Enums.PedidoTipo;
            createdAt: Date;
            updatedAt: Date;
            usuarioId: string | null;
            vendedorId: string | null;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import("@prisma/client").$Enums.PedidoEstado;
            metodoPago: string | null;
            entregado: boolean;
            fechaEntrega: Date | null;
            entregadoPorId: string | null;
            ticketData: string | null;
        };
        message: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDulceriaItemDto: UpdateDulceriaItemDto): Promise<{
        id: string;
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    activar(id: string): Promise<{
        message: string;
        dulceriaItem: {
            id: string;
            nombre: string;
            tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
            descripcion: string | null;
            precio: import("@prisma/client/runtime/library").Decimal;
            imagenUrl: string | null;
            stock: number;
            activo: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        dulceriaItem: {
            id: string;
            nombre: string;
            tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
            descripcion: string | null;
            precio: import("@prisma/client/runtime/library").Decimal;
            imagenUrl: string | null;
            stock: number;
            activo: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
