import { User } from './user.model';

export interface Carrito {
  id: string;
  usuarioId?: string;
  vendedorId?: string;
  tipo: CarritoTipo;
  expiracion: string;
  createdAt: string;
  updatedAt: string;
  usuario?: User;
  vendedor?: User;
  items?: CarritoItem[];
}

export interface CarritoItem {
  id: string;
  carritoId: string;
  tipo: CarritoItemTipo;
  referenciaId: string;
  cantidad: number;
  precioUnitario: number;
  createdAt: string;
}

export enum CarritoTipo {
  CLIENTE = 'CLIENTE',
  MOSTRADOR = 'MOSTRADOR'
}

export enum CarritoItemTipo {
  BOLETO = 'BOLETO',
  DULCERIA = 'DULCERIA'
}

export interface CreateCarritoRequest {
  usuarioId?: string;
  vendedorId?: string;
  tipo: CarritoTipo;
}

export interface AddItemRequest {
  tipo: CarritoItemTipo;
  referenciaId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface UpdateItemRequest {
  cantidad: number;
}
