import { PrismaService } from '../common/prisma/prisma.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { UpdateAsientosDanadosDto } from './dto/update-asientos-danados.dto';
export declare class SalasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSalaDto: CreateSalaDto): Promise<{
        id: string;
        nombre: string;
        filas: number;
        asientosPorFila: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: any): Promise<import("../common/dto/pagination.dto").PaginatedResponseDto<{
        asientos: {
            id: string;
            fila: number;
            numero: number;
            estado: import("@prisma/client").$Enums.AsientoEstado;
        }[];
        _count: {
            asientos: number;
            funciones: number;
        };
    } & {
        id: string;
        nombre: string;
        filas: number;
        asientosPorFila: number;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findOne(id: string): Promise<{
        asientos: {
            id: string;
            salaId: string;
            fila: number;
            numero: number;
            estado: import("@prisma/client").$Enums.AsientoEstado;
        }[];
        _count: {
            asientos: number;
            funciones: number;
        };
    } & {
        id: string;
        nombre: string;
        filas: number;
        asientosPorFila: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateSalaDto: UpdateSalaDto): Promise<{
        id: string;
        nombre: string;
        filas: number;
        asientosPorFila: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateAsientosDanados(id: string, updateAsientosDanadosDto: UpdateAsientosDanadosDto): Promise<{
        message: string;
        asientosDanadosCount: number;
        asientosDanados: {
            fila: number;
            numero: number;
            estado: import("@prisma/client").$Enums.AsientoEstado;
        }[];
    }>;
    getAsientosDisponibilidad(salaId: string, funcionId: string): Promise<{
        disponible: boolean;
        id: string;
        salaId: string;
        fila: number;
        numero: number;
        estado: import("@prisma/client").$Enums.AsientoEstado;
    }[]>;
}
