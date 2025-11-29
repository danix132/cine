export interface Sala {
  id: string;
  nombre: string;
  filas: number;
  asientosPorFila: number;
  createdAt: string;
  updatedAt: string;
  asientos?: Asiento[];
  _count?: {
    asientos: number;
    funciones: number;
  };
  // Conteo de asientos dañados calculado desde el array de asientos
  asientosDanados?: number;
}

export interface Asiento {
  id: string;
  salaId: string;
  fila: number;
  numero: number;
  estado: AsientoEstado;
  sala?: Sala;
}

export enum AsientoEstado {
  DISPONIBLE = 'DISPONIBLE',
  DANADO = 'DANADO',
  NO_EXISTE = 'NO_EXISTE'
}

export interface CreateSalaRequest {
  nombre: string;
  filas: number;
  asientosPorFila: number;
}

export interface UpdateSalaRequest {
  nombre?: string;
  filas?: number;
  asientosPorFila?: number;
}

export interface AsientoDanado {
  fila: number;
  numero: number;
  estado?: 'DISPONIBLE' | 'DANADO' | 'NO_EXISTE';
}

export interface UpdateAsientosDanadosRequest {
  asientosDanados: AsientoDanado[];
}
