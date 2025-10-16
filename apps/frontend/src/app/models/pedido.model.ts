import { User } from './user.model';

export interface Pedido {
  id: string;
  usuarioId?: string;
  vendedorId?: string;
  total: number;
  tipo: PedidoTipo;
  estado?: PedidoEstado;
  metodoPago?: string;
  createdAt: string;
  updatedAt: string;
  usuario?: User;
  vendedor?: User;
  items?: PedidoItem[];
}

export interface PedidoItem {
  id: string;
  pedidoId: string;
  tipo: PedidoItemTipo;
  referenciaId: string;
  descripcion?: string;
  cantidad: number;
  precio?: number;
  precioUnitario: number;
  subtotal?: number;
  createdAt: string;
  pedido?: Pedido;
}

export enum PedidoTipo {
  WEB = 'WEB',
  MOSTRADOR = 'MOSTRADOR'
}

export enum PedidoItemTipo {
  BOLETO = 'BOLETO',
  DULCERIA = 'DULCERIA'
}

export enum PedidoEstado {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}

export interface CreatePedidoRequest {
  usuarioId?: string;
  vendedorId?: string;
  tipo: PedidoTipo;
}

export interface UpdatePedidoRequest {
  total?: number;
}
