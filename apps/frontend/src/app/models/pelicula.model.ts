export interface Pelicula {
  id: string;
  titulo: string;
  sinopsis?: string;
  duracionMin: number;
  clasificacion: string;
  posterUrl?: string;
  trailerUrl?: string;
  generos: string[];
  estado: PeliculaEstado;
  esProximoEstreno?: boolean;
  fechaEstreno?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PeliculaEstado {
  ACTIVA = 'ACTIVA',
  INACTIVA = 'INACTIVA'
}

export interface CreatePeliculaRequest {
  titulo: string;
  sinopsis?: string;
  duracionMin: number;
  clasificacion: string;
  posterUrl?: string;
  trailerUrl?: string;
  generos: string[];
}

export interface UpdatePeliculaRequest {
  titulo?: string;
  sinopsis?: string;
  duracionMin?: number;
  clasificacion?: string;
  posterUrl?: string;
  trailerUrl?: string;
  generos?: string[];
  estado?: PeliculaEstado;
  esProximoEstreno?: boolean;
  fechaEstreno?: string;
}
