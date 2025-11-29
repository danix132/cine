import { Funcion } from './funcion.model';
import { Asiento } from './sala.model';
import { User } from './user.model';

export interface Boleto {
  id: string;
  funcionId: string;
  asientoId: string;
  usuarioId?: string;
  estado: BoletoEstado;
  codigoQR: string;
  fechaValidacion?: string | Date;
  ticketData?: string;
  createdAt: string;
  updatedAt: string;
  funcion?: Funcion;
  asiento?: Asiento;
  usuario?: User;
}

export enum BoletoEstado {
  RESERVADO = 'RESERVADO',
  PAGADO = 'PAGADO',
  VALIDADO = 'VALIDADO',
  CANCELADO = 'CANCELADO'
}

export interface CreateBoletoRequest {
  funcionId: string;
  asientoId: string;
  usuarioId?: string;
  estado?: BoletoEstado;
  vendedorId?: string;  // Para reportes de ventas
  precio?: number;      // Para reportes de ventas
}

export interface UpdateBoletoRequest {
  estado?: BoletoEstado;
  ticketData?: string;
}
