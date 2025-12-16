import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
export declare class BoletosController {
    private readonly boletosService;
    constructor(boletosService: BoletosService);
    create(createBoletoDto: CreateBoletoDto): Promise<{
        asiento: {
            id: string;
            fila: number;
            numero: number;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
        };
        funcion: {
            sala: {
                nombre: string;
            };
            pelicula: {
                titulo: string;
                posterUrl: string;
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
        usuario: {
            nombre: string;
            email: string;
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
        ticketData: string | null;
    }>;
    findAll(): Promise<({
        asiento: {
            id: string;
            fila: number;
            numero: number;
        };
        funcion: {
            sala: {
                nombre: string;
                id: string;
            };
            pelicula: {
                id: string;
                titulo: string;
            };
            id: string;
            inicio: Date;
            precio: import("@prisma/client/runtime/library").Decimal;
        };
        usuario: {
            nombre: string;
            email: string;
            id: string;
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
        ticketData: string | null;
    })[]>;
    findOne(id: string): Promise<{
        asiento: {
            id: string;
            fila: number;
            numero: number;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
        };
        funcion: {
            sala: {
                nombre: string;
            };
            pelicula: {
                titulo: string;
                posterUrl: string;
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
        usuario: {
            nombre: string;
            email: string;
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
        ticketData: string | null;
    }>;
    update(id: string, updateBoletoDto: UpdateBoletoDto): Promise<{
        asiento: {
            id: string;
            fila: number;
            numero: number;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
        };
        funcion: {
            sala: {
                nombre: string;
            };
            pelicula: {
                titulo: string;
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
        usuario: {
            nombre: string;
            email: string;
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
        ticketData: string | null;
    }>;
    remove(id: string): Promise<{
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
        ticketData: string | null;
    }>;
    getBoletosPorFuncion(funcionId: string): Promise<({
        asiento: {
            id: string;
            fila: number;
            numero: number;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
        };
        funcion: {
            sala: {
                nombre: string;
            };
            pelicula: {
                titulo: string;
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
        usuario: {
            nombre: string;
            email: string;
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
        ticketData: string | null;
    })[]>;
    verificarQR(body: {
        codigoQR: string;
    }): Promise<{
        valido: boolean;
        mensaje: string;
        boletos?: undefined;
        cantidad?: undefined;
    } | {
        valido: boolean;
        boletos: ({
            asiento: {
                id: string;
                fila: number;
                numero: number;
                estado: import("@prisma/client").$Enums.AsientoEstado;
                salaId: string;
            };
            funcion: {
                sala: {
                    nombre: string;
                };
                pelicula: {
                    titulo: string;
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
            usuario: {
                nombre: string;
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
            ticketData: string | null;
        })[];
        cantidad: number;
        mensaje: string;
    }>;
    validarBoleto(codigoQR: string): Promise<{
        asiento: {
            id: string;
            fila: number;
            numero: number;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
        };
        funcion: {
            sala: {
                nombre: string;
            };
            pelicula: {
                titulo: string;
                posterUrl: string;
            };
            id: string;
            inicio: Date;
            cancelada: boolean;
            precio: import("@prisma/client/runtime/library").Decimal;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        estado: import("@prisma/client").$Enums.BoletoEstado;
        funcionId: string;
        asientoId: string;
        usuarioId: string;
        pedidoId: string;
        codigoQR: string;
        fechaValidacion: Date;
        usuario: {
            nombre: string;
            email: string;
        };
    }[]>;
    crearBoletosCompra(body: {
        funcionId: string;
        asientoIds: string[];
        usuarioId?: string;
    }): Promise<any[]>;
}
