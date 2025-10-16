import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
export declare class BoletosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createBoletoDto: CreateBoletoDto): Promise<{
        funcion: {
            pelicula: {
                titulo: string;
                posterUrl: string;
            };
            sala: {
                nombre: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            peliculaId: string;
            salaId: string;
            inicio: Date;
            cancelada: boolean;
            precio: import("@prisma/client/runtime/library").Decimal;
        };
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
        };
        usuario: {
            nombre: string;
            email: string;
        };
    } & {
        id: string;
        estado: import("@prisma/client").$Enums.BoletoEstado;
        codigoQR: string;
        fechaValidacion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        funcionId: string;
        asientoId: string;
        usuarioId: string | null;
        pedidoId: string | null;
    }>;
    findAll(): Promise<({
        funcion: {
            id: string;
            pelicula: {
                id: string;
                titulo: string;
            };
            sala: {
                id: string;
                nombre: string;
            };
            inicio: Date;
            precio: import("@prisma/client/runtime/library").Decimal;
        };
        asiento: {
            id: string;
            fila: number;
            numero: number;
        };
        usuario: {
            id: string;
            nombre: string;
            email: string;
        };
    } & {
        id: string;
        estado: import("@prisma/client").$Enums.BoletoEstado;
        codigoQR: string;
        fechaValidacion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        funcionId: string;
        asientoId: string;
        usuarioId: string | null;
        pedidoId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        funcion: {
            pelicula: {
                titulo: string;
                posterUrl: string;
            };
            sala: {
                nombre: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            peliculaId: string;
            salaId: string;
            inicio: Date;
            cancelada: boolean;
            precio: import("@prisma/client/runtime/library").Decimal;
        };
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
        };
        usuario: {
            nombre: string;
            email: string;
        };
    } & {
        id: string;
        estado: import("@prisma/client").$Enums.BoletoEstado;
        codigoQR: string;
        fechaValidacion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        funcionId: string;
        asientoId: string;
        usuarioId: string | null;
        pedidoId: string | null;
    }>;
    update(id: string, updateBoletoDto: UpdateBoletoDto): Promise<{
        funcion: {
            pelicula: {
                titulo: string;
            };
            sala: {
                nombre: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            peliculaId: string;
            salaId: string;
            inicio: Date;
            cancelada: boolean;
            precio: import("@prisma/client/runtime/library").Decimal;
        };
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
        };
        usuario: {
            nombre: string;
            email: string;
        };
    } & {
        id: string;
        estado: import("@prisma/client").$Enums.BoletoEstado;
        codigoQR: string;
        fechaValidacion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        funcionId: string;
        asientoId: string;
        usuarioId: string | null;
        pedidoId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        estado: import("@prisma/client").$Enums.BoletoEstado;
        codigoQR: string;
        fechaValidacion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        funcionId: string;
        asientoId: string;
        usuarioId: string | null;
        pedidoId: string | null;
    }>;
    getBoletosPorFuncion(funcionId: string): Promise<({
        funcion: {
            pelicula: {
                titulo: string;
            };
            sala: {
                nombre: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            peliculaId: string;
            salaId: string;
            inicio: Date;
            cancelada: boolean;
            precio: import("@prisma/client/runtime/library").Decimal;
        };
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
        };
        usuario: {
            nombre: string;
            email: string;
        };
    } & {
        id: string;
        estado: import("@prisma/client").$Enums.BoletoEstado;
        codigoQR: string;
        fechaValidacion: Date | null;
        createdAt: Date;
        updatedAt: Date;
        funcionId: string;
        asientoId: string;
        usuarioId: string | null;
        pedidoId: string | null;
    })[]>;
    verificarQR(codigoQR: string): Promise<{
        valido: boolean;
        mensaje: string;
        boletos?: undefined;
        cantidad?: undefined;
    } | {
        valido: boolean;
        boletos: ({
            funcion: {
                pelicula: {
                    titulo: string;
                };
                sala: {
                    nombre: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                peliculaId: string;
                salaId: string;
                inicio: Date;
                cancelada: boolean;
                precio: import("@prisma/client/runtime/library").Decimal;
            };
            asiento: {
                id: string;
                estado: import("@prisma/client").$Enums.AsientoEstado;
                salaId: string;
                fila: number;
                numero: number;
            };
            usuario: {
                nombre: string;
            };
        } & {
            id: string;
            estado: import("@prisma/client").$Enums.BoletoEstado;
            codigoQR: string;
            fechaValidacion: Date | null;
            createdAt: Date;
            updatedAt: Date;
            funcionId: string;
            asientoId: string;
            usuarioId: string | null;
            pedidoId: string | null;
        })[];
        cantidad: number;
        mensaje: string;
    }>;
    validarBoleto(codigoQR: string): Promise<{
        id: string;
        estado: import("@prisma/client").$Enums.BoletoEstado;
        codigoQR: string;
        fechaValidacion: Date;
        createdAt: Date;
        updatedAt: Date;
        funcion: {
            id: string;
            pelicula: {
                titulo: string;
                posterUrl: string;
            };
            sala: {
                nombre: string;
            };
            inicio: Date;
            cancelada: boolean;
            precio: import("@prisma/client/runtime/library").Decimal;
        };
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
        };
        usuario: {
            nombre: string;
            email: string;
        };
        funcionId: string;
        asientoId: string;
        usuarioId: string;
        pedidoId: string;
    }[]>;
    crearBoletosCompra(data: {
        funcionId: string;
        asientoIds: string[];
        usuarioId?: string;
    }): Promise<any[]>;
}
