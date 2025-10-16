import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
export declare class PeliculasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPeliculaDto: CreatePeliculaDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        estado: import("@prisma/client").$Enums.PeliculaEstado;
        titulo: string;
        sinopsis: string | null;
        duracionMin: number;
        clasificacion: string;
        posterUrl: string | null;
        trailerUrl: string | null;
        generos: string[];
    }>;
    findAll(query: any): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        _count: {
            funciones: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        estado: import("@prisma/client").$Enums.PeliculaEstado;
        titulo: string;
        sinopsis: string | null;
        duracionMin: number;
        clasificacion: string;
        posterUrl: string | null;
        trailerUrl: string | null;
        generos: string[];
    }>>;
    findActive(): Promise<({
        funciones: ({
            sala: {
                id: string;
                nombre: string;
                filas: number;
                asientosPorFila: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            salaId: string;
            peliculaId: string;
            inicio: Date;
            cancelada: boolean;
            precio: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        estado: import("@prisma/client").$Enums.PeliculaEstado;
        titulo: string;
        sinopsis: string | null;
        duracionMin: number;
        clasificacion: string;
        posterUrl: string | null;
        trailerUrl: string | null;
        generos: string[];
    })[]>;
    findOne(id: string): Promise<{
        funciones: ({
            sala: {
                id: string;
                nombre: string;
                filas: number;
                asientosPorFila: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            salaId: string;
            peliculaId: string;
            inicio: Date;
            cancelada: boolean;
            precio: import("@prisma/client/runtime/library").Decimal;
        })[];
        _count: {
            funciones: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        estado: import("@prisma/client").$Enums.PeliculaEstado;
        titulo: string;
        sinopsis: string | null;
        duracionMin: number;
        clasificacion: string;
        posterUrl: string | null;
        trailerUrl: string | null;
        generos: string[];
    }>;
    update(id: string, updatePeliculaDto: UpdatePeliculaDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        estado: import("@prisma/client").$Enums.PeliculaEstado;
        titulo: string;
        sinopsis: string | null;
        duracionMin: number;
        clasificacion: string;
        posterUrl: string | null;
        trailerUrl: string | null;
        generos: string[];
    }>;
    remove(id: string): Promise<{
        message: string;
        eliminacionCompleta: boolean;
        funcionesEliminadas?: undefined;
    } | {
        message: string;
        eliminacionCompleta: boolean;
        funcionesEliminadas: number;
    }>;
    forceRemove(id: string): Promise<{
        message: string;
        eliminacionForzada: boolean;
        titulo: string;
        datosEliminados: {
            boletosAfectados: number;
            itemsCarritoEliminados: number;
            itemsPedidoEliminados: number;
        };
    }>;
    findByGenero(genero: string): Promise<({
        funciones: ({
            sala: {
                id: string;
                nombre: string;
                filas: number;
                asientosPorFila: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            salaId: string;
            peliculaId: string;
            inicio: Date;
            cancelada: boolean;
            precio: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        estado: import("@prisma/client").$Enums.PeliculaEstado;
        titulo: string;
        sinopsis: string | null;
        duracionMin: number;
        clasificacion: string;
        posterUrl: string | null;
        trailerUrl: string | null;
        generos: string[];
    })[]>;
}
