import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDulceriaItemDto } from './dto/create-dulceria-item.dto';
import { UpdateDulceriaItemDto } from './dto/update-dulceria-item.dto';
export declare class DulceriaService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDulceriaItemDto: CreateDulceriaItemDto): Promise<{
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: any): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        _count: {
            movimientos: number;
        };
    } & {
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findActive(): Promise<{
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByTipo(tipo: string): Promise<{
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDulceriaItemDto: UpdateDulceriaItemDto): Promise<{
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        stock: number;
        activo: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
        dulceriaItem: {
            nombre: string;
            tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
            descripcion: string | null;
            precio: import("@prisma/client/runtime/library").Decimal;
            imagenUrl: string | null;
            stock: number;
            activo: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    activar(id: string): Promise<{
        message: string;
        dulceriaItem: {
            nombre: string;
            tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
            descripcion: string | null;
            precio: import("@prisma/client/runtime/library").Decimal;
            imagenUrl: string | null;
            stock: number;
            activo: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    registrarMovimiento(dulceriaItemId: string, delta: number, motivo: string): Promise<{
        id: string;
        createdAt: Date;
        dulceriaItemId: string;
        delta: number;
        motivo: string;
    }>;
    obtenerInventario(): Promise<{
        stock: number;
        _count: {
            movimientos: number;
        };
        nombre: string;
        tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
        descripcion: string | null;
        precio: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        activo: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    procesarVenta(ventaDto: any, vendedorId: string): Promise<{
        success: boolean;
        pedido: {
            items: {
                producto: {
                    id: string;
                    nombre: string;
                    tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
                };
                tipo: import("@prisma/client").$Enums.PedidoItemTipo;
                descripcion: string | null;
                precio: import("@prisma/client/runtime/library").Decimal;
                id: string;
                createdAt: Date;
                pedidoId: string;
                referenciaId: string;
                cantidad: number;
                precioUnitario: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            }[];
            vendedor: {
                nombre: string;
                id: string;
                email: string;
            };
            tipo: import("@prisma/client").$Enums.PedidoTipo;
            id: string;
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
}
