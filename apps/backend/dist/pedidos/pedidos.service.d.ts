import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
export declare class PedidosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createPedidoDto: CreatePedidoDto): Promise<{
        usuario: {
            nombre: string;
            email: string;
        };
        vendedor: {
            nombre: string;
            email: string;
        };
        items: ({
            pedido: {
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
        } & {
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
        })[];
    } & {
        id: string;
        total: import("@prisma/client/runtime/library").Decimal;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        metodoPago: string | null;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
    }>;
    findAll(query: any): Promise<{
        pedidos: ({
            usuario: {
                nombre: string;
                email: string;
            };
            vendedor: {
                nombre: string;
                email: string;
            };
            items: ({
                pedido: {
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
            } & {
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
            })[];
        } & {
            id: string;
            total: import("@prisma/client/runtime/library").Decimal;
            tipo: import("@prisma/client").$Enums.PedidoTipo;
            estado: import("@prisma/client").$Enums.PedidoEstado;
            metodoPago: string | null;
            createdAt: Date;
            updatedAt: Date;
            usuarioId: string | null;
            vendedorId: string | null;
        })[];
        total: number;
        page: any;
        limit: any;
    }>;
    findOne(id: string): Promise<{
        items: ({
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
        } | {
            dulceriaItem: {
                tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
                precio: import("@prisma/client/runtime/library").Decimal;
                nombre: string;
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
        })[];
        usuario: {
            nombre: string;
            email: string;
        };
        vendedor: {
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
    }>;
    update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<{
        usuario: {
            nombre: string;
            email: string;
        };
        vendedor: {
            nombre: string;
            email: string;
        };
        items: ({
            pedido: {
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
        } & {
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
        })[];
    } & {
        id: string;
        total: import("@prisma/client/runtime/library").Decimal;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        metodoPago: string | null;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        total: import("@prisma/client/runtime/library").Decimal;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        metodoPago: string | null;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
    }>;
    findMyOrders(usuarioId: string): Promise<({
        items: ({
            pedido: {
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
        } & {
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
        })[];
    } & {
        id: string;
        total: import("@prisma/client/runtime/library").Decimal;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        metodoPago: string | null;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string | null;
        vendedorId: string | null;
    })[]>;
}
