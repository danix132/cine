import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
export declare class BoletosController {
    private readonly boletosService;
    constructor(boletosService: BoletosService);
    create(createBoletoDto: CreateBoletoDto): Promise<{
        usuario: {
            nombre: string;
            email: string;
        };
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
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
            precio: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            salaId: string;
            peliculaId: string;
            inicio: Date;
            cancelada: boolean;
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
    }>;
    findAll(): Promise<({
        usuario: {
            nombre: string;
            id: string;
            email: string;
        };
        asiento: {
            id: string;
            fila: number;
            numero: number;
        };
        funcion: {
            precio: import("@prisma/client/runtime/library").Decimal;
            id: string;
            sala: {
                nombre: string;
                id: string;
            };
            pelicula: {
                id: string;
                titulo: string;
            };
            inicio: Date;
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
    })[]>;
    findOne(id: string): Promise<{
        usuario: {
            nombre: string;
            email: string;
        };
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
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
            precio: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            salaId: string;
            peliculaId: string;
            inicio: Date;
            cancelada: boolean;
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
    }>;
    update(id: string, updateBoletoDto: UpdateBoletoDto): Promise<{
        usuario: {
            nombre: string;
            email: string;
        };
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
        };
        funcion: {
            sala: {
                nombre: string;
            };
            pelicula: {
                titulo: string;
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    getBoletosPorFuncion(funcionId: string): Promise<({
        usuario: {
            nombre: string;
            email: string;
        };
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
        };
        funcion: {
            sala: {
                nombre: string;
            };
            pelicula: {
                titulo: string;
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
            usuario: {
                nombre: string;
            };
            asiento: {
                id: string;
                estado: import("@prisma/client").$Enums.AsientoEstado;
                salaId: string;
                fila: number;
                numero: number;
            };
            funcion: {
                sala: {
                    nombre: string;
                };
                pelicula: {
                    titulo: string;
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
        cantidad: number;
        mensaje: string;
    }>;
    validarBoleto(codigoQR: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string;
        estado: import("@prisma/client").$Enums.BoletoEstado;
        usuario: {
            nombre: string;
            email: string;
        };
        pedidoId: string;
        asiento: {
            id: string;
            estado: import("@prisma/client").$Enums.AsientoEstado;
            salaId: string;
            fila: number;
            numero: number;
        };
        funcion: {
            precio: import("@prisma/client/runtime/library").Decimal;
            id: string;
            sala: {
                nombre: string;
            };
            pelicula: {
                titulo: string;
                posterUrl: string;
            };
            inicio: Date;
            cancelada: boolean;
        };
        funcionId: string;
        asientoId: string;
        codigoQR: string;
        fechaValidacion: Date;
    }[]>;
    crearBoletosCompra(body: {
        funcionId: string;
        asientoIds: string[];
        usuarioId?: string;
    }): Promise<any[]>;
}
