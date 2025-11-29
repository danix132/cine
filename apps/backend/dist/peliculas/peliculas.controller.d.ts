import { PeliculasService } from './peliculas.service';
import { RecomendacionesService } from './recomendaciones.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class PeliculasController {
    private readonly peliculasService;
    private readonly recomendacionesService;
    constructor(peliculasService: PeliculasService, recomendacionesService: RecomendacionesService);
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
        esProximoEstreno: boolean;
        fechaEstreno: Date | null;
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
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
        esProximoEstreno: boolean;
        fechaEstreno: Date | null;
    }>>;
    findActive(): Promise<({
        funciones: ({
            sala: {
                nombre: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                filas: number;
                asientosPorFila: number;
            };
        } & {
            precio: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            salaId: string;
            peliculaId: string;
            inicio: Date;
            cancelada: boolean;
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
        esProximoEstreno: boolean;
        fechaEstreno: Date | null;
    })[]>;
    findByGenero(genero: string): Promise<({
        funciones: ({
            sala: {
                nombre: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                filas: number;
                asientosPorFila: number;
            };
        } & {
            precio: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            salaId: string;
            peliculaId: string;
            inicio: Date;
            cancelada: boolean;
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
        esProximoEstreno: boolean;
        fechaEstreno: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            funciones: number;
        };
        funciones: ({
            sala: {
                nombre: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                filas: number;
                asientosPorFila: number;
            };
        } & {
            precio: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            salaId: string;
            peliculaId: string;
            inicio: Date;
            cancelada: boolean;
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
        esProximoEstreno: boolean;
        fechaEstreno: Date | null;
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
        esProximoEstreno: boolean;
        fechaEstreno: Date | null;
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
    getRecomendaciones(req: any): Promise<{
        recomendacion: string;
        peliculas: ({
            funciones: ({
                sala: {
                    nombre: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    filas: number;
                    asientosPorFila: number;
                };
            } & {
                precio: import("@prisma/client/runtime/library").Decimal;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                salaId: string;
                peliculaId: string;
                inicio: Date;
                cancelada: boolean;
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
            esProximoEstreno: boolean;
            fechaEstreno: Date | null;
        })[];
        tienePeferencias: boolean;
        generosPreferidos?: undefined;
    } | {
        recomendacion: string;
        peliculas: ({
            funciones: ({
                sala: {
                    nombre: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    filas: number;
                    asientosPorFila: number;
                };
            } & {
                precio: import("@prisma/client/runtime/library").Decimal;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                salaId: string;
                peliculaId: string;
                inicio: Date;
                cancelada: boolean;
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
            esProximoEstreno: boolean;
            fechaEstreno: Date | null;
        })[];
        tienePeferencias: boolean;
        generosPreferidos: string[];
    }>;
}
