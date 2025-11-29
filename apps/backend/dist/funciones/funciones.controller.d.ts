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
            esProximoEstreno: boolean;
            fechaEstreno: Date | null;
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
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        _count: {
            boletos: number;
        };
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
    } & {
        precio: import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        salaId: string;
        peliculaId: string;
        inicio: Date;
        cancelada: boolean;
    }>>;
    findUpcoming(): Promise<({
        _count: {
            boletos: number;
        };
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
            esProximoEstreno: boolean;
            fechaEstreno: Date | null;
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
    })[]>;
    findDisponibles(): Promise<({
        _count: {
            boletos: number;
        };
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
            esProximoEstreno: boolean;
            fechaEstreno: Date | null;
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
    })[]>;
    findByPelicula(peliculaId: string): Promise<({
        _count: {
            boletos: number;
        };
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
    })[]>;
    findBySala(salaId: string): Promise<({
        _count: {
            boletos: number;
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
            esProximoEstreno: boolean;
            fechaEstreno: Date | null;
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
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            boletos: number;
        };
        boletos: ({
            usuario: {
                nombre: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                rol: import("@prisma/client").$Enums.UserRole;
                generosPreferidos: string | null;
            };
            asiento: {
                id: string;
                estado: import("@prisma/client").$Enums.AsientoEstado;
                salaId: string;
                fila: number;
                numero: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            usuarioId: string | null;
            estado: import("@prisma/client").$Enums.BoletoEstado;
            ticketData: string | null;
            pedidoId: string | null;
            funcionId: string;
            asientoId: string;
            codigoQR: string;
            fechaValidacion: Date | null;
        })[];
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
            esProximoEstreno: boolean;
            fechaEstreno: Date | null;
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
            esProximoEstreno: boolean;
            fechaEstreno: Date | null;
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
                esProximoEstreno: boolean;
                fechaEstreno: Date | null;
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
                esProximoEstreno: boolean;
                fechaEstreno: Date | null;
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
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
