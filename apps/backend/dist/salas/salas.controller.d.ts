import { SalasService } from './salas.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { UpdateAsientosDanadosDto } from './dto/update-asientos-danados.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class SalasController {
    private readonly salasService;
    constructor(salasService: SalasService);
    create(createSalaDto: CreateSalaDto): Promise<{
        nombre: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        filas: number;
        asientosPorFila: number;
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        _count: {
            funciones: number;
            asientos: number;
        };
        asientos: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            fila: number;
            numero: number;
        }[];
    } & {
        nombre: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        filas: number;
        asientosPorFila: number;
    }>>;
    findOne(id: string): Promise<{
        _count: {
            funciones: number;
            asientos: number;
        };
        asientos: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
        }[];
    } & {
        nombre: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        filas: number;
        asientosPorFila: number;
    }>;
    update(id: string, updateSalaDto: UpdateSalaDto): Promise<{
        nombre: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        filas: number;
        asientosPorFila: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateAsientosDanados(id: string, updateAsientosDanadosDto: UpdateAsientosDanadosDto): Promise<{
        message: string;
        asientosDanadosCount: number;
        asientosNoExistenCount: number;
        asientos: {
            estado: import("@prisma/client").$Enums.AsientoEstado;
            fila: number;
            numero: number;
        }[];
    }>;
    getAsientosDisponibilidad(id: string, funcionId: string): Promise<{
        disponible: boolean;
        id: string;
        estado: import("@prisma/client").$Enums.AsientoEstado;
        salaId: string;
        fila: number;
        numero: number;
    }[]>;
}
