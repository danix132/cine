import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
export declare class PedidosController {
    private readonly pedidosService;
    constructor(pedidosService: PedidosService);
    create(createPedidoDto: CreatePedidoDto): Promise<{
        items: ({
            pedido: {
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
        } & {
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
    }>;
    findAll(query: any): Promise<{
        pedidos: ({
            items: ({
                pedido: {
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
            } & {
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
        })[];
        total: number;
        page: any;
        limit: any;
    }>;
    findMyOrders(usuarioId: string): Promise<({
        items: ({
            pedido: {
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
        } & {
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
    })[]>;
    findOne(id: string): Promise<{
        items: ({
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
        } | {
            dulceriaItem: {
                nombre: string;
                tipo: import("@prisma/client").$Enums.DulceriaItemTipo;
                precio: import("@prisma/client/runtime/library").Decimal;
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
        })[];
        usuario: {
            nombre: string;
            email: string;
        };
        vendedor: {
            nombre: string;
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
    }>;
    update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<{
        items: ({
            pedido: {
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
        } & {
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
    }>;
    marcarComoEntregado(id: string, vendedorId: string): Promise<{
        items: {
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
        usuario: {
            nombre: string;
            email: string;
        };
        vendedor: {
            nombre: string;
            email: string;
        };
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
