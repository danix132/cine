import { PedidoTipo, PedidoItemTipo } from '@prisma/client';
export declare class CreatePedidoItemDto {
    tipo: PedidoItemTipo;
    referenciaId: string;
    descripcion?: string;
    cantidad: number;
    precio: number;
    precioUnitario: number;
    subtotal?: number;
}
export declare class CreatePedidoDto {
    usuarioId?: string;
    vendedorId?: string;
    total: number;
    tipo: PedidoTipo;
    items: CreatePedidoItemDto[];
    ticketData?: string;
}
