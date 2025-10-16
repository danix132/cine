import { Pelicula } from './pelicula.model';
import { Sala } from './sala.model';

export interface Funcion {
  id: string;
  peliculaId: string;
  salaId: string;
  inicio: string;
  cancelada: boolean;
  precio: number;
  createdAt: string;
  updatedAt: string;
  pelicula?: Pelicula;
  sala?: Sala;
  _count?: {
    boletos: number;
  };
}

export interface CreateFuncionRequest {
  peliculaId: string;
  salaId: string;
  inicio: string;
  precio: number;
  forzarCreacion?: boolean;
}

export interface UpdateFuncionRequest {
  peliculaId?: string;
  salaId?: string;
  inicio?: string;
  cancelada?: boolean;
  precio?: number;
  forzarActualizacion?: boolean;
}
