"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoletosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let BoletosService = class BoletosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBoletoDto) {
        console.log('🎫 BACKEND: Iniciando creación de boleto con DTO:', createBoletoDto);
        const funcionExists = await this.prisma.funcion.findUnique({
            where: { id: createBoletoDto.funcionId }
        });
        if (!funcionExists) {
            console.error('❌ BACKEND: Función no encontrada:', createBoletoDto.funcionId);
            throw new common_1.NotFoundException('Función no encontrada');
        }
        const asientoExists = await this.prisma.asiento.findUnique({
            where: { id: createBoletoDto.asientoId }
        });
        if (!asientoExists) {
            console.error('❌ BACKEND: Asiento no encontrado:', createBoletoDto.asientoId);
            throw new common_1.NotFoundException('Asiento no encontrado');
        }
        if (createBoletoDto.usuarioId) {
            const usuarioExists = await this.prisma.user.findUnique({
                where: { id: createBoletoDto.usuarioId }
            });
            if (!usuarioExists) {
                console.error('❌ BACKEND: Usuario no encontrado:', createBoletoDto.usuarioId);
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            console.log('✅ BACKEND: Usuario validado:', usuarioExists.email);
        }
        const boletoExistente = await this.prisma.boleto.findFirst({
            where: {
                funcionId: createBoletoDto.funcionId,
                asientoId: createBoletoDto.asientoId,
                estado: { not: 'CANCELADO' }
            }
        });
        if (boletoExistente) {
            console.error('❌ BACKEND: Asiento ya ocupado para esta función');
            throw new Error('El asiento ya está ocupado para esta función');
        }
        const codigoQR = `BOLETO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log('🔧 BACKEND: Creando boleto con datos:', {
            funcionId: createBoletoDto.funcionId,
            asientoId: createBoletoDto.asientoId,
            usuarioId: createBoletoDto.usuarioId,
            estado: createBoletoDto.estado || 'RESERVADO',
            codigoQR
        });
        try {
            const boleto = await this.prisma.boleto.create({
                data: {
                    funcionId: createBoletoDto.funcionId,
                    asientoId: createBoletoDto.asientoId,
                    usuarioId: createBoletoDto.usuarioId,
                    estado: createBoletoDto.estado || 'RESERVADO',
                    codigoQR,
                },
                include: {
                    funcion: {
                        include: {
                            pelicula: { select: { titulo: true, posterUrl: true } },
                            sala: { select: { nombre: true } },
                        },
                    },
                    asiento: true,
                    usuario: { select: { nombre: true, email: true } },
                },
            });
            console.log('✅ BACKEND: Boleto creado exitosamente:', boleto.id);
            if (createBoletoDto.estado === 'PAGADO' && createBoletoDto.vendedorId) {
                console.log('💰 BACKEND: Creando pedido para venta en efectivo');
                console.log('👤 BACKEND: VendedorId para pedido:', createBoletoDto.vendedorId);
                try {
                    const precioBoleto = createBoletoDto.precio || Number(boleto.funcion.precio);
                    console.log('📝 BACKEND: Creando pedido con datos:', {
                        usuarioId: createBoletoDto.usuarioId,
                        vendedorId: createBoletoDto.vendedorId,
                        total: precioBoleto,
                        tipo: 'MOSTRADOR',
                        estado: 'COMPLETADO',
                        metodoPago: 'EFECTIVO',
                        fecha: new Date(),
                        pelicula: boleto.funcion.pelicula.titulo
                    });
                    const pedido = await this.prisma.pedido.create({
                        data: {
                            usuarioId: createBoletoDto.usuarioId,
                            vendedorId: createBoletoDto.vendedorId,
                            total: precioBoleto,
                            tipo: 'MOSTRADOR',
                            estado: 'COMPLETADO',
                            metodoPago: 'EFECTIVO',
                            items: {
                                create: {
                                    tipo: 'BOLETO',
                                    referenciaId: boleto.id,
                                    descripcion: `Boleto - ${boleto.funcion.pelicula.titulo}`,
                                    cantidad: 1,
                                    precio: precioBoleto,
                                    precioUnitario: precioBoleto,
                                    subtotal: precioBoleto,
                                }
                            }
                        },
                        include: {
                            items: true,
                            usuario: { select: { nombre: true, email: true } },
                            vendedor: { select: { nombre: true, email: true } }
                        }
                    });
                    console.log('✅ BACKEND: Pedido creado para reportes:', pedido.id);
                    await this.prisma.boleto.update({
                        where: { id: boleto.id },
                        data: { pedidoId: pedido.id }
                    });
                }
                catch (errorPedido) {
                    console.error('⚠️ BACKEND: Error creando pedido para reportes (boleto ya creado):', errorPedido);
                }
            }
            return boleto;
        }
        catch (error) {
            console.error('❌ BACKEND: Error al crear boleto en base de datos:', error);
            throw error;
        }
    }
    async findAll() {
        console.log('📋 SERVICE: findAll() ejecutado');
        const boletos = await this.prisma.boleto.findMany({
            include: {
                funcion: {
                    select: {
                        id: true,
                        inicio: true,
                        precio: true,
                        pelicula: {
                            select: {
                                id: true,
                                titulo: true,
                            },
                        },
                        sala: {
                            select: {
                                id: true,
                                nombre: true,
                            },
                        },
                    },
                },
                asiento: {
                    select: {
                        id: true,
                        fila: true,
                        numero: true,
                    },
                },
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        console.log(`✅ SERVICE: ${boletos.length} boletos encontrados`);
        return boletos;
    }
    async findOne(id) {
        const boleto = await this.prisma.boleto.findUnique({
            where: { id },
            include: {
                funcion: {
                    include: {
                        pelicula: { select: { titulo: true, posterUrl: true } },
                        sala: { select: { nombre: true } },
                    },
                },
                asiento: true,
                usuario: { select: { nombre: true, email: true } },
            },
        });
        if (!boleto) {
            throw new common_1.NotFoundException('Boleto no encontrado');
        }
        return boleto;
    }
    async update(id, updateBoletoDto) {
        await this.findOne(id);
        const updateData = {};
        if (updateBoletoDto.funcionId)
            updateData.funcionId = updateBoletoDto.funcionId;
        if (updateBoletoDto.asientoId)
            updateData.asientoId = updateBoletoDto.asientoId;
        if (updateBoletoDto.usuarioId !== undefined)
            updateData.usuarioId = updateBoletoDto.usuarioId;
        if (updateBoletoDto.estado)
            updateData.estado = updateBoletoDto.estado;
        return this.prisma.boleto.update({
            where: { id },
            data: updateData,
            include: {
                funcion: {
                    include: {
                        pelicula: { select: { titulo: true } },
                        sala: { select: { nombre: true } },
                    },
                },
                asiento: true,
                usuario: { select: { nombre: true, email: true } },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.boleto.delete({
            where: { id },
        });
    }
    async getBoletosPorFuncion(funcionId) {
        console.log('🎫 BACKEND: Obteniendo boletos para función:', funcionId);
        const funcionExists = await this.prisma.funcion.findUnique({
            where: { id: funcionId }
        });
        if (!funcionExists) {
            console.error('❌ BACKEND: Función no encontrada:', funcionId);
            throw new common_1.NotFoundException('Función no encontrada');
        }
        const boletos = await this.prisma.boleto.findMany({
            where: {
                funcionId: funcionId,
                estado: { not: 'CANCELADO' }
            },
            include: {
                asiento: true,
                usuario: { select: { nombre: true, email: true } },
                funcion: {
                    include: {
                        pelicula: { select: { titulo: true } },
                        sala: { select: { nombre: true } },
                    },
                },
            },
            orderBy: [
                { asiento: { fila: 'asc' } },
                { asiento: { numero: 'asc' } }
            ]
        });
        console.log(`✅ BACKEND: Encontrados ${boletos.length} boletos activos para función ${funcionId}`);
        return boletos;
    }
    async verificarQR(codigoQR) {
        const boletos = await this.prisma.boleto.findMany({
            where: { codigoQR },
            include: {
                funcion: {
                    include: {
                        pelicula: { select: { titulo: true } },
                        sala: { select: { nombre: true } },
                    },
                },
                asiento: true,
                usuario: { select: { nombre: true } },
            },
        });
        if (!boletos || boletos.length === 0) {
            return { valido: false, mensaje: 'Boleto no encontrado' };
        }
        const boletoPrincipal = boletos[0];
        if (boletoPrincipal.funcion.cancelada) {
            return { valido: false, mensaje: 'Función cancelada' };
        }
        if (boletoPrincipal.estado === 'CANCELADO') {
            return { valido: false, mensaje: 'Boleto cancelado' };
        }
        return {
            valido: true,
            boletos,
            cantidad: boletos.length,
            mensaje: boletos.length > 1
                ? `${boletos.length} boletos válidos`
                : 'Boleto válido',
        };
    }
    async validarBoleto(codigoQR) {
        console.log('🎫 SERVICE: Validando boleto(s) con código QR:', codigoQR);
        const boletos = await this.prisma.boleto.findMany({
            where: { codigoQR },
            select: {
                id: true,
                funcionId: true,
                asientoId: true,
                usuarioId: true,
                pedidoId: true,
                estado: true,
                codigoQR: true,
                fechaValidacion: true,
                createdAt: true,
                updatedAt: true,
                funcion: {
                    select: {
                        id: true,
                        inicio: true,
                        cancelada: true,
                        precio: true,
                        pelicula: {
                            select: {
                                titulo: true,
                                posterUrl: true
                            }
                        },
                        sala: {
                            select: {
                                nombre: true
                            }
                        },
                    },
                },
                asiento: true,
                usuario: {
                    select: {
                        nombre: true,
                        email: true
                    }
                },
            },
        });
        if (!boletos || boletos.length === 0) {
            console.error('❌ SERVICE: No se encontraron boletos con QR:', codigoQR);
            throw new common_1.NotFoundException('Boleto no encontrado');
        }
        console.log(`📊 SERVICE: Encontrados ${boletos.length} boleto(s) con este QR`);
        const boletoPrincipal = boletos[0];
        if (boletoPrincipal.fechaValidacion) {
            console.warn('⚠️ SERVICE: Boletos ya fueron validados anteriormente:', {
                cantidad: boletos.length,
                fechaValidacion: boletoPrincipal.fechaValidacion
            });
            const mensajeError = boletos.length > 1
                ? `Los ${boletos.length} boletos ya fueron validados el ${boletoPrincipal.fechaValidacion.toLocaleString('es-ES')}`
                : `Boleto ya fue validado el ${boletoPrincipal.fechaValidacion.toLocaleString('es-ES')}`;
            throw new common_1.BadRequestException(mensajeError);
        }
        if (boletoPrincipal.estado !== 'PAGADO') {
            console.warn('⚠️ SERVICE: Boletos no están en estado PAGADO:', boletoPrincipal.estado);
            throw new common_1.BadRequestException(`Boletos no válidos. Estado: ${boletoPrincipal.estado}`);
        }
        if (boletoPrincipal.funcion.cancelada) {
            console.warn('⚠️ SERVICE: La función está cancelada');
            throw new common_1.BadRequestException('La función fue cancelada');
        }
        const fechaValidacion = new Date();
        await this.prisma.boleto.updateMany({
            where: { codigoQR },
            data: {
                fechaValidacion,
                estado: 'VALIDADO'
            }
        });
        console.log(`✅ SERVICE: ${boletos.length} boleto(s) validado(s) exitosamente`);
        const boletosValidados = await this.prisma.boleto.findMany({
            where: { codigoQR },
            select: {
                id: true,
                funcionId: true,
                asientoId: true,
                usuarioId: true,
                pedidoId: true,
                estado: true,
                codigoQR: true,
                fechaValidacion: true,
                createdAt: true,
                updatedAt: true,
                funcion: {
                    select: {
                        id: true,
                        inicio: true,
                        cancelada: true,
                        precio: true,
                        pelicula: {
                            select: {
                                titulo: true,
                                posterUrl: true
                            }
                        },
                        sala: {
                            select: {
                                nombre: true
                            }
                        },
                    },
                },
                asiento: true,
                usuario: {
                    select: {
                        nombre: true,
                        email: true
                    }
                },
            },
        });
        console.log('✅ SERVICE: Boletos validados exitosamente:', {
            cantidad: boletosValidados.length,
            ids: boletosValidados.map(b => b.id),
            asientos: boletosValidados.map(b => `${b.asiento.fila}-${b.asiento.numero}`),
            fechaValidacion
        });
        return boletosValidados;
    }
    async crearBoletosCompra(data) {
        console.log('🛒 SERVICE: Creando boletos para compra:', data);
        const funcion = await this.prisma.funcion.findUnique({
            where: { id: data.funcionId },
            include: {
                pelicula: { select: { titulo: true, posterUrl: true } },
                sala: { select: { nombre: true } },
            }
        });
        if (!funcion) {
            console.error('❌ SERVICE: Función no encontrada:', data.funcionId);
            throw new common_1.NotFoundException('Función no encontrada');
        }
        const asientos = await this.prisma.asiento.findMany({
            where: { id: { in: data.asientoIds } }
        });
        if (asientos.length !== data.asientoIds.length) {
            console.error('❌ SERVICE: Algunos asientos no fueron encontrados');
            throw new common_1.NotFoundException('Algunos asientos no fueron encontrados');
        }
        const boletosExistentes = await this.prisma.boleto.findMany({
            where: {
                funcionId: data.funcionId,
                asientoId: { in: data.asientoIds },
                estado: { not: 'CANCELADO' }
            }
        });
        if (boletosExistentes.length > 0) {
            console.error('❌ SERVICE: Algunos asientos ya están ocupados');
            throw new common_1.BadRequestException('Algunos asientos ya están ocupados para esta función');
        }
        const codigoQRCompra = `COMPRA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log('🎫 SERVICE: Código QR único para la compra:', codigoQRCompra);
        const boletos = [];
        for (const asientoId of data.asientoIds) {
            const asiento = asientos.find(a => a.id === asientoId);
            const boleto = await this.prisma.boleto.create({
                data: {
                    funcionId: data.funcionId,
                    asientoId: asientoId,
                    usuarioId: data.usuarioId,
                    estado: 'PAGADO',
                    codigoQR: codigoQRCompra,
                },
                include: {
                    funcion: {
                        include: {
                            pelicula: { select: { titulo: true, posterUrl: true } },
                            sala: { select: { nombre: true } },
                        },
                    },
                    asiento: true,
                    usuario: { select: { nombre: true, email: true } },
                },
            });
            boletos.push(boleto);
            console.log('✅ SERVICE: Boleto creado:', {
                id: boleto.id,
                codigoQR: boleto.codigoQR,
                asiento: `${boleto.asiento.fila}-${boleto.asiento.numero}`
            });
        }
        console.log(`✅ SERVICE: ${boletos.length} boletos creados exitosamente con QR compartido: ${codigoQRCompra}`);
        if (data.usuarioId && boletos.length > 0) {
            try {
                const precioBoleto = Number(funcion.precio);
                const totalCompra = precioBoleto * boletos.length;
                const pedido = await this.prisma.pedido.create({
                    data: {
                        usuarioId: data.usuarioId,
                        total: totalCompra,
                        tipo: 'WEB',
                        estado: 'COMPLETADO',
                        metodoPago: 'TARJETA',
                        items: {
                            create: boletos.map(boleto => ({
                                tipo: 'BOLETO',
                                referenciaId: boleto.id,
                                descripcion: `${funcion.pelicula.titulo} - ${funcion.sala.nombre} - Asiento ${boleto.asiento.fila}${boleto.asiento.numero}`,
                                cantidad: 1,
                                precio: funcion.precio,
                                precioUnitario: funcion.precio,
                                subtotal: funcion.precio,
                            }))
                        }
                    }
                });
                await this.prisma.boleto.updateMany({
                    where: { id: { in: boletos.map(b => b.id) } },
                    data: { pedidoId: pedido.id }
                });
                console.log('✅ SERVICE: Pedido creado para compra online:', {
                    pedidoId: pedido.id,
                    total: pedido.total,
                    cantidadItems: boletos.length
                });
            }
            catch (error) {
                console.error('⚠️ SERVICE: Error al crear pedido para compra online:', error);
            }
        }
        return boletos;
    }
};
exports.BoletosService = BoletosService;
exports.BoletosService = BoletosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoletosService);
//# sourceMappingURL=boletos.service.js.map