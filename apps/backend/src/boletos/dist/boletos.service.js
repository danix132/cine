"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.BoletosService = void 0;
var common_1 = require("@nestjs/common");
var BoletosService = /** @class */ (function () {
    function BoletosService(prisma) {
        this.prisma = prisma;
    }
    BoletosService.prototype.create = function (createBoletoDto) {
        return __awaiter(this, void 0, void 0, function () {
            var funcionExists, asientoExists, usuarioExists, boletoExistente, codigoQR, boleto, precioBoleto, pedido, errorPedido_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🎫 BACKEND: Iniciando creación de boleto con DTO:', createBoletoDto);
                        return [4 /*yield*/, this.prisma.funcion.findUnique({
                                where: { id: createBoletoDto.funcionId }
                            })];
                    case 1:
                        funcionExists = _a.sent();
                        if (!funcionExists) {
                            console.error('❌ BACKEND: Función no encontrada:', createBoletoDto.funcionId);
                            throw new common_1.NotFoundException('Función no encontrada');
                        }
                        return [4 /*yield*/, this.prisma.asiento.findUnique({
                                where: { id: createBoletoDto.asientoId }
                            })];
                    case 2:
                        asientoExists = _a.sent();
                        if (!asientoExists) {
                            console.error('❌ BACKEND: Asiento no encontrado:', createBoletoDto.asientoId);
                            throw new common_1.NotFoundException('Asiento no encontrado');
                        }
                        if (!createBoletoDto.usuarioId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: createBoletoDto.usuarioId }
                            })];
                    case 3:
                        usuarioExists = _a.sent();
                        if (!usuarioExists) {
                            console.error('❌ BACKEND: Usuario no encontrado:', createBoletoDto.usuarioId);
                            throw new common_1.NotFoundException('Usuario no encontrado');
                        }
                        console.log('✅ BACKEND: Usuario validado:', usuarioExists.email);
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.prisma.boleto.findFirst({
                            where: {
                                funcionId: createBoletoDto.funcionId,
                                asientoId: createBoletoDto.asientoId,
                                estado: { not: 'CANCELADO' }
                            }
                        })];
                    case 5:
                        boletoExistente = _a.sent();
                        if (boletoExistente) {
                            console.error('❌ BACKEND: Asiento ya ocupado para esta función');
                            throw new Error('El asiento ya está ocupado para esta función');
                        }
                        codigoQR = "BOLETO-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
                        console.log('🔧 BACKEND: Creando boleto con datos:', {
                            funcionId: createBoletoDto.funcionId,
                            asientoId: createBoletoDto.asientoId,
                            usuarioId: createBoletoDto.usuarioId,
                            estado: createBoletoDto.estado || 'RESERVADO',
                            codigoQR: codigoQR
                        });
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 13, , 14]);
                        return [4 /*yield*/, this.prisma.boleto.create({
                                data: {
                                    funcionId: createBoletoDto.funcionId,
                                    asientoId: createBoletoDto.asientoId,
                                    usuarioId: createBoletoDto.usuarioId,
                                    estado: createBoletoDto.estado || 'RESERVADO',
                                    codigoQR: codigoQR
                                },
                                include: {
                                    funcion: {
                                        include: {
                                            pelicula: { select: { titulo: true, posterUrl: true } },
                                            sala: { select: { nombre: true } }
                                        }
                                    },
                                    asiento: true,
                                    usuario: { select: { nombre: true, email: true } }
                                }
                            })];
                    case 7:
                        boleto = _a.sent();
                        console.log('✅ BACKEND: Boleto creado exitosamente:', boleto.id);
                        if (!(createBoletoDto.estado === 'PAGADO' && createBoletoDto.vendedorId)) return [3 /*break*/, 12];
                        console.log('💰 BACKEND: Creando pedido para venta en efectivo');
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 11, , 12]);
                        precioBoleto = createBoletoDto.precio || Number(boleto.funcion.precio);
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
                        return [4 /*yield*/, this.prisma.pedido.create({
                                data: {
                                    usuarioId: createBoletoDto.usuarioId,
                                    vendedorId: createBoletoDto.vendedorId,
                                    total: precioBoleto,
                                    tipo: 'MOSTRADOR',
                                    estado: 'COMPLETADO',
                                    metodoPago: 'EFECTIVO',
                                    // Crear item del pedido
                                    items: {
                                        create: {
                                            tipo: 'BOLETO',
                                            referenciaId: boleto.id,
                                            descripcion: "Boleto - " + boleto.funcion.pelicula.titulo,
                                            cantidad: 1,
                                            precio: precioBoleto,
                                            precioUnitario: precioBoleto,
                                            subtotal: precioBoleto
                                        }
                                    }
                                },
                                include: {
                                    items: true,
                                    usuario: { select: { nombre: true, email: true } },
                                    vendedor: { select: { nombre: true, email: true } }
                                }
                            })];
                    case 9:
                        pedido = _a.sent();
                        console.log('✅ BACKEND: Pedido creado para reportes:', pedido.id);
                        // Actualizar el boleto con el pedidoId para referencia
                        return [4 /*yield*/, this.prisma.boleto.update({
                                where: { id: boleto.id },
                                data: { pedidoId: pedido.id }
                            })];
                    case 10:
                        // Actualizar el boleto con el pedidoId para referencia
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        errorPedido_1 = _a.sent();
                        console.error('⚠️ BACKEND: Error creando pedido para reportes (boleto ya creado):', errorPedido_1);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/, boleto];
                    case 13:
                        error_1 = _a.sent();
                        console.error('❌ BACKEND: Error al crear boleto en base de datos:', error_1);
                        throw error_1;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    BoletosService.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.boleto.findMany({
                        include: {
                            funcion: {
                                include: {
                                    pelicula: { select: { titulo: true } },
                                    sala: { select: { nombre: true } }
                                }
                            },
                            asiento: true,
                            usuario: { select: { nombre: true, email: true } }
                        },
                        orderBy: { createdAt: 'desc' }
                    })];
            });
        });
    };
    BoletosService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var boleto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.boleto.findUnique({
                            where: { id: id },
                            include: {
                                funcion: {
                                    include: {
                                        pelicula: { select: { titulo: true, posterUrl: true } },
                                        sala: { select: { nombre: true } }
                                    }
                                },
                                asiento: true,
                                usuario: { select: { nombre: true, email: true } }
                            }
                        })];
                    case 1:
                        boleto = _a.sent();
                        if (!boleto) {
                            throw new common_1.NotFoundException('Boleto no encontrado');
                        }
                        return [2 /*return*/, boleto];
                }
            });
        });
    };
    BoletosService.prototype.update = function (id, updateBoletoDto) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        _a.sent();
                        updateData = {};
                        if (updateBoletoDto.funcionId)
                            updateData.funcionId = updateBoletoDto.funcionId;
                        if (updateBoletoDto.asientoId)
                            updateData.asientoId = updateBoletoDto.asientoId;
                        if (updateBoletoDto.usuarioId !== undefined)
                            updateData.usuarioId = updateBoletoDto.usuarioId;
                        if (updateBoletoDto.estado)
                            updateData.estado = updateBoletoDto.estado;
                        return [2 /*return*/, this.prisma.boleto.update({
                                where: { id: id },
                                data: updateData,
                                include: {
                                    funcion: {
                                        include: {
                                            pelicula: { select: { titulo: true } },
                                            sala: { select: { nombre: true } }
                                        }
                                    },
                                    asiento: true,
                                    usuario: { select: { nombre: true, email: true } }
                                }
                            })];
                }
            });
        });
    };
    BoletosService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.boleto["delete"]({
                                where: { id: id }
                            })];
                }
            });
        });
    };
    BoletosService.prototype.getBoletosPorFuncion = function (funcionId) {
        return __awaiter(this, void 0, void 0, function () {
            var funcionExists, boletos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🎫 BACKEND: Obteniendo boletos para función:', funcionId);
                        return [4 /*yield*/, this.prisma.funcion.findUnique({
                                where: { id: funcionId }
                            })];
                    case 1:
                        funcionExists = _a.sent();
                        if (!funcionExists) {
                            console.error('❌ BACKEND: Función no encontrada:', funcionId);
                            throw new common_1.NotFoundException('Función no encontrada');
                        }
                        return [4 /*yield*/, this.prisma.boleto.findMany({
                                where: {
                                    funcionId: funcionId,
                                    estado: { not: 'CANCELADO' } // Solo boletos activos
                                },
                                include: {
                                    asiento: true,
                                    usuario: { select: { nombre: true, email: true } },
                                    funcion: {
                                        include: {
                                            pelicula: { select: { titulo: true } },
                                            sala: { select: { nombre: true } }
                                        }
                                    }
                                },
                                orderBy: [
                                    { asiento: { fila: 'asc' } },
                                    { asiento: { numero: 'asc' } }
                                ]
                            })];
                    case 2:
                        boletos = _a.sent();
                        console.log("\u2705 BACKEND: Encontrados " + boletos.length + " boletos activos para funci\u00F3n " + funcionId);
                        return [2 /*return*/, boletos];
                }
            });
        });
    };
    BoletosService.prototype.verificarQR = function (codigoQR) {
        return __awaiter(this, void 0, void 0, function () {
            var boleto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.boleto.findUnique({
                            where: { codigoQR: codigoQR },
                            include: {
                                funcion: {
                                    include: {
                                        pelicula: { select: { titulo: true } },
                                        sala: { select: { nombre: true } }
                                    }
                                },
                                asiento: true,
                                usuario: { select: { nombre: true } }
                            }
                        })];
                    case 1:
                        boleto = _a.sent();
                        if (!boleto) {
                            return [2 /*return*/, { valido: false, mensaje: 'Boleto no encontrado' }];
                        }
                        if (boleto.funcion.cancelada) {
                            return [2 /*return*/, { valido: false, mensaje: 'Función cancelada' }];
                        }
                        if (boleto.estado === 'CANCELADO') {
                            return [2 /*return*/, { valido: false, mensaje: 'Boleto cancelado' }];
                        }
                        return [2 /*return*/, {
                                valido: true,
                                boleto: boleto,
                                mensaje: 'Boleto válido'
                            }];
                }
            });
        });
    };
    BoletosService.prototype.validarBoleto = function (codigoQR) {
        return __awaiter(this, void 0, void 0, function () {
            var boleto, boletoValidado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🎫 SERVICE: Validando boleto con código QR:', codigoQR);
                        return [4 /*yield*/, this.prisma.boleto.findUnique({
                                where: { codigoQR: codigoQR },
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
                                            }
                                        }
                                    },
                                    asiento: true,
                                    usuario: {
                                        select: {
                                            nombre: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        boleto = _a.sent();
                        if (!boleto) {
                            console.error('❌ SERVICE: Boleto no encontrado con QR:', codigoQR);
                            throw new common_1.NotFoundException('Boleto no encontrado');
                        }
                        // ⚠️ VERIFICAR SI YA FUE VALIDADO/ESCANEADO
                        if (boleto.fechaValidacion) {
                            console.warn('⚠️ SERVICE: Boleto ya fue validado anteriormente:', {
                                id: boleto.id,
                                fechaValidacion: boleto.fechaValidacion
                            });
                            throw new common_1.BadRequestException("Boleto ya fue validado el " + boleto.fechaValidacion.toLocaleString('es-ES'));
                        }
                        // ⚠️ VERIFICAR ESTADO
                        if (boleto.estado !== 'PAGADO') {
                            console.warn('⚠️ SERVICE: Boleto no está en estado PAGADO:', boleto.estado);
                            throw new common_1.BadRequestException("Boleto no v\u00E1lido. Estado: " + boleto.estado);
                        }
                        // ⚠️ VERIFICAR FUNCIÓN NO CANCELADA
                        if (boleto.funcion.cancelada) {
                            console.warn('⚠️ SERVICE: La función está cancelada');
                            throw new common_1.BadRequestException('La función fue cancelada');
                        }
                        return [4 /*yield*/, this.prisma.boleto.update({
                                where: { id: boleto.id },
                                data: { fechaValidacion: new Date() },
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
                                            }
                                        }
                                    },
                                    asiento: true,
                                    usuario: {
                                        select: {
                                            nombre: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                    case 2:
                        boletoValidado = _a.sent();
                        console.log('✅ SERVICE: Boleto validado exitosamente:', {
                            id: boletoValidado.id,
                            estado: boletoValidado.estado,
                            fechaValidacion: boletoValidado.fechaValidacion
                        });
                        return [2 /*return*/, boletoValidado];
                }
            });
        });
    };
    BoletosService = __decorate([
        common_1.Injectable()
    ], BoletosService);
    return BoletosService;
}());
exports.BoletosService = BoletosService;
