import { FuncionesService } from './funciones.service';
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { UpdateFuncionDto } from './dto/update-funcion.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class FuncionesController {
    private readonly funcionesService;
    constructor(funcionesService: FuncionesService);
    debugConflictos(createFuncionDto: CreateFuncionDto): Promise<{
        error: string;
        pelicula: any;
        sala?: undefined;
        datosNuevaFuncion?: undefined;
        funcionesExistentes?: undefined;
        analisisConflictos?: undefined;
        hayConflictos?: undefined;
        mensaje?: undefined;
    } | {
        error: string;
        sala: any;
        pelicula?: undefined;
        datosNuevaFuncion?: undefined;
        funcionesExistentes?: undefined;
        analisisConflictos?: undefined;
        hayConflictos?: undefined;
        mensaje?: undefined;
    } | {
        datosNuevaFuncion: {
            pelicula: string;
            sala: string;
            inicio: string;
            fin: string;
            duracion: number;
        };
        funcionesExistentes: number;
        analisisConflictos: any[];
        hayConflictos: boolean;
        mensaje: string;
        error?: undefined;
        pelicula?: undefined;
        sala?: undefined;
    }>;
    create(createFuncionDto: CreateFuncionDto): Promise<{
        sala: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            filas: number;
            asientosPorFila: number;
        };
        pelicula: {
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
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        sala: {
            nombre: string;
            id: string;
            filas: number;
            asientosPorFila: number;
        };
        pelicula: {
            id: string;
            titulo: string;
            duracionMin: number;
            clasificacion: string;
            posterUrl: string;
            generos: string[];
        };
        _count: {
            boletos: number;
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
    }>>;
    findUpcoming(): Promise<({
        sala: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            filas: number;
            asientosPorFila: number;
        };
        pelicula: {
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
        };
        _count: {
            boletos: number;
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
    })[]>;
    findDisponibles(): Promise<({
        sala: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            filas: number;
            asientosPorFila: number;
        };
        pelicula: {
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
        };
        _count: {
            boletos: number;
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
    })[]>;
    findByPelicula(peliculaId: string): Promise<({
        sala: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            filas: number;
            asientosPorFila: number;
        };
        _count: {
            boletos: number;
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
    })[]>;
    findBySala(salaId: string): Promise<({
        pelicula: {
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
        };
        _count: {
            boletos: number;
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
    })[]>;
    findOne(id: string): Promise<{
        sala: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            filas: number;
            asientosPorFila: number;
        };
        pelicula: {
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
        };
        boletos: ({
            asiento: {
                id: string;
                salaId: string;
                fila: number;
                numero: number;
                estado: import("@prisma/client").$Enums.AsientoEstado;
            };
            usuario: {
                email: string;
                nombre: string;
                rol: import("@prisma/client").$Enums.UserRole;
                id: string;
                passwordHash: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            estado: import("@prisma/client").$Enums.BoletoEstado;
            funcionId: string;
            asientoId: string;
            usuarioId: string | null;
            pedidoId: string | null;
            codigoQR: string;
            fechaValidacion: Date | null;
        })[];
        _count: {
            boletos: number;
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
    }>;
    update(id: string, updateFuncionDto: UpdateFuncionDto): Promise<{
        sala: {
            nombre: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            filas: number;
            asientosPorFila: number;
        };
        pelicula: {
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
    }>;
    cancelar(id: string): Promise<{
        message: string;
        funcion: {
            sala: {
                nombre: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                filas: number;
                asientosPorFila: number;
            };
            pelicula: {
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
        };
    }>;
    reactivar(id: string): Promise<{
        message: string;
        funcion: {
            sala: {
                nombre: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                filas: number;
                asientosPorFila: number;
            };
            pelicula: {
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
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
