export interface DulceriaItem {
  id: string;
  nombre: string;
  tipo: DulceriaItemTipo;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  movimientos?: InventarioMov[];
}

export interface InventarioMov {
  id: string;
  dulceriaItemId: string;
  delta: number;
  motivo: string;
  createdAt: string;
  dulceriaItem?: DulceriaItem;
}

export enum DulceriaItemTipo {
  COMBO = 'COMBO',
  DULCE = 'DULCE'
}

export interface CreateDulceriaItemRequest {
  nombre: string;
  tipo: DulceriaItemTipo;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
}

export interface UpdateDulceriaItemRequest {
  nombre?: string;
  tipo?: DulceriaItemTipo;
  descripcion?: string;
  precio?: number;
  imagenUrl?: string;
  activo?: boolean;
}
