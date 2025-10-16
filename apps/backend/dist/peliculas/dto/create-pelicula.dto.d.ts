import { PeliculaEstado } from '@prisma/client';
export declare class CreatePeliculaDto {
    titulo: string;
    sinopsis?: string;
    duracionMin: number;
    clasificacion: string;
    posterUrl?: string;
    trailerUrl?: string;
    generos: string[];
    estado?: PeliculaEstado;
}
