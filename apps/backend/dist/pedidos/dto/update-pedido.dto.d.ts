import { CreatePedidoDto } from './create-pedido.dto';
import { PedidoEstado } from '@prisma/client';
declare const UpdatePedidoDto_base: import("@nestjs/common").Type<Partial<CreatePedidoDto>>;
export declare class UpdatePedidoDto extends UpdatePedidoDto_base {
    estado?: PedidoEstado;
    entregado?: boolean;
    fechaEntrega?: string;
}
export {};
