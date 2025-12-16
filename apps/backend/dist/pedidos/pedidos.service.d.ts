import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
export declare class PedidosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createPedidoDto: CreatePedidoDto): Promise<{
        items: ({
            pedido: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                total: import("@prisma/client/runtime/library").Decimal;
                estado: import("@prisma/client").$Enums.PedidoEstado;
                usuarioId: string | null;
                ticketData: string | null;
                vendedorId: string | null;
                tipo: import("@prisma/client").$Enums.PedidoTipo;
                metodoPago: string | null;
                entregado: boolean;
                fechaEntrega: Date | null;
                entregadoPorId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            pedidoId: string;
            precio: import("@prisma/client/runtime/library").Decimal;
            tipo: import("@prisma/client").$Enums.PedidoItemTipo;
            referenciaId: string;
            descripcion: string | null;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        })[];
        usuario: {
            nombre: string;
            email: string;
        };
        vendedor: {
            nombre: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        usuarioId: string | null;
        ticketData: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        metodoPago: string | null;
        entregado: boolean;
        fechaEntrega: Date | null;
        entregadoPorId: string | null;
    }>;
    findAll(query: any): Promise<{
        pedidos: ({
            items: ({
                pedido: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    total: import("@prisma/client/runtime/library").Decimal;
                    estado: import("@prisma/client").$Enums.PedidoEstado;
                    usuarioId: string | null;
                    ticketData: string | null;
                    vendedorId: string | null;
                    tipo: import("@prisma/client").$Enums.PedidoTipo;
                    metodoPago: string | null;
                    entregado: boolean;
                    fechaEntrega: Date | null;
                    entregadoPorId: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                pedidoId: string;
                precio: import("@prisma/client/runtime/library").Decimal;
                tipo: import("@prisma/client").$Enums.PedidoItemTipo;
                referenciaId: string;
                descripcion: string | null;
                cantidad: number;
                precioUnitario: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            })[];
            usuario: {
                nombre: string;
                email: string;
            };
            vendedor: {
                nombre: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            estado: import("@prisma/client").$Enums.PedidoEstado;
            usuarioId: string | null;
            ticketData: string | null;
            vendedorId: string | null;
            tipo: import("@prisma/client").$Enums.PedidoTipo;
            metodoPago: string | null;
            entregado: boolean;
            fechaEntrega: Date | null;
            entregadoPorId: string | null;
        })[];
        total: number;
        page: any;
        limit: any;
    }>;
    findOne(id: string): Promise<{
        items: ({
            id: string;
            createdAt: Date;
            pedidoId: string;
            precio: import("@prisma/client/runtime/library").Decimal;
            tipo: import("@prisma/client").$Enums.PedidoItemTipo;
            referenciaId: string;
            descripcion: string | null;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        } | {
            dulceriaItem: {
                nombre: string;
                precio: import("@prisma/client/runtime/library").Decimal;
                tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
            };
            id: string;
            createdAt: Date;
            pedidoId: string;
            precio: import("@prisma/client/runtime/library").Decimal;
            tipo: import("@prisma/client").$Enums.PedidoItemTipo;
            referenciaId: string;
            descripcion: string | null;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
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
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        usuarioId: string | null;
        ticketData: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        metodoPago: string | null;
        entregado: boolean;
        fechaEntrega: Date | null;
        entregadoPorId: string | null;
    }>;
    update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<{
        items: ({
            pedido: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                total: import("@prisma/client/runtime/library").Decimal;
                estado: import("@prisma/client").$Enums.PedidoEstado;
                usuarioId: string | null;
                ticketData: string | null;
                vendedorId: string | null;
                tipo: import("@prisma/client").$Enums.PedidoTipo;
                metodoPago: string | null;
                entregado: boolean;
                fechaEntrega: Date | null;
                entregadoPorId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            pedidoId: string;
            precio: import("@prisma/client/runtime/library").Decimal;
            tipo: import("@prisma/client").$Enums.PedidoItemTipo;
            referenciaId: string;
            descripcion: string | null;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        })[];
        usuario: {
            nombre: string;
            email: string;
        };
        vendedor: {
            nombre: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        usuarioId: string | null;
        ticketData: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        metodoPago: string | null;
        entregado: boolean;
        fechaEntrega: Date | null;
        entregadoPorId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        usuarioId: string | null;
        ticketData: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        metodoPago: string | null;
        entregado: boolean;
        fechaEntrega: Date | null;
        entregadoPorId: string | null;
    }>;
    marcarComoEntregado(id: string, vendedorId: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            pedidoId: string;
            precio: import("@prisma/client/runtime/library").Decimal;
            tipo: import("@prisma/client").$Enums.PedidoItemTipo;
            referenciaId: string;
            descripcion: string | null;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        }[];
        usuario: {
            nombre: string;
            email: string;
        };
        vendedor: {
            nombre: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        usuarioId: string | null;
        ticketData: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        metodoPago: string | null;
        entregado: boolean;
        fechaEntrega: Date | null;
        entregadoPorId: string | null;
    }>;
    findMyOrders(usuarioId: string): Promise<({
        items: ({
            pedido: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                total: import("@prisma/client/runtime/library").Decimal;
                estado: import("@prisma/client").$Enums.PedidoEstado;
                usuarioId: string | null;
                ticketData: string | null;
                vendedorId: string | null;
                tipo: import("@prisma/client").$Enums.PedidoTipo;
                metodoPago: string | null;
                entregado: boolean;
                fechaEntrega: Date | null;
                entregadoPorId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            pedidoId: string;
            precio: import("@prisma/client/runtime/library").Decimal;
            tipo: import("@prisma/client").$Enums.PedidoItemTipo;
            referenciaId: string;
            descripcion: string | null;
            cantidad: number;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
        })[];
        usuario: {
            nombre: string;
            email: string;
        };
        vendedor: {
            nombre: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        estado: import("@prisma/client").$Enums.PedidoEstado;
        usuarioId: string | null;
        ticketData: string | null;
        vendedorId: string | null;
        tipo: import("@prisma/client").$Enums.PedidoTipo;
        metodoPago: string | null;
        entregado: boolean;
        fechaEntrega: Date | null;
        entregadoPorId: string | null;
    })[]>;
}
