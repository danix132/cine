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
exports.CarritosService = void 0;
var common_1 = require("@nestjs/common");
var pagination_dto_1 = require("../common/dto/pagination.dto");
var moment = require("moment-timezone");
var CarritosService = /** @class */ (function () {
    function CarritosService(prisma) {
        this.prisma = prisma;
    }
    CarritosService.prototype.create = function (createCarritoDto, userId, vendedorId) {
        return __awaiter(this, void 0, void 0, function () {
            var tipo, expiracion, carrito;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tipo = createCarritoDto.tipo;
                        if (tipo === 'CLIENTE') {
                            expiracion = moment.tz('America/Mazatlan').add(10, 'minutes').toDate(); // 10 min para clientes
                        }
                        else {
                            expiracion = moment.tz('America/Mazatlan').add(30, 'minutes').toDate(); // 30 min para mostrador
                        }
                        return [4 /*yield*/, this.prisma.carrito.create({
                                data: {
                                    usuarioId: userId,
                                    vendedorId: vendedorId,
                                    tipo: tipo,
                                    expiracion: expiracion
                                },
                                include: {
                                    items: true,
                                    usuario: true,
                                    vendedor: true
                                }
                            })];
                    case 1:
                        carrito = _a.sent();
                        return [2 /*return*/, carrito];
                }
            });
        });
    };
    CarritosService.prototype.findAll = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, _c, search, tipo, usuarioId, vendedorId, skip, where, _d, carritos, total;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, _c = query.search, search = _c === void 0 ? '' : _c, tipo = query.tipo, usuarioId = query.usuarioId, vendedorId = query.vendedorId;
                        skip = (page - 1) * limit;
                        where = {};
                        if (search) {
                            where = {
                                OR: [
                                    { usuario: { nombre: { contains: search, mode: 'insensitive' } } },
                                    { vendedor: { nombre: { contains: search, mode: 'insensitive' } } },
                                ]
                            };
                        }
                        if (tipo)
                            where.tipo = tipo;
                        if (usuarioId)
                            where.usuarioId = usuarioId;
                        if (vendedorId)
                            where.vendedorId = vendedorId;
                        return [4 /*yield*/, Promise.all([
                                this.prisma.carrito.findMany({
                                    where: where,
                                    include: {
                                        usuario: { select: { id: true, nombre: true, email: true } },
                                        vendedor: { select: { id: true, nombre: true, email: true } },
                                        items: {
                                            include: {
                                                carrito: true
                                            }
                                        }
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' }
                                }),
                                this.prisma.carrito.count({ where: where }),
                            ])];
                    case 1:
                        _d = _e.sent(), carritos = _d[0], total = _d[1];
                        return [2 /*return*/, pagination_dto_1.createPaginatedResponse(carritos, total, page, limit)];
                }
            });
        });
    };
    CarritosService.prototype.findOne = function (id, userId, vendedorId) {
        return __awaiter(this, void 0, void 0, function () {
            var carrito;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.carrito.findUnique({
                            where: { id: id },
                            include: {
                                items: true,
                                usuario: true,
                                vendedor: true
                            }
                        })];
                    case 1:
                        carrito = _a.sent();
                        if (!carrito) {
                            throw new common_1.NotFoundException('Carrito no encontrado');
                        }
                        // Verificar acceso
                        if (carrito.usuarioId && carrito.usuarioId !== userId) {
                            throw new common_1.ForbiddenException('No tienes acceso a este carrito');
                        }
                        if (carrito.vendedorId && carrito.vendedorId !== vendedorId) {
                            throw new common_1.ForbiddenException('No tienes acceso a este carrito');
                        }
                        // Verificar si expiró
                        if (new Date() > carrito.expiracion) {
                            throw new common_1.BadRequestException('El carrito ha expirado');
                        }
                        return [2 /*return*/, carrito];
                }
            });
        });
    };
    CarritosService.prototype.addItem = function (id, addItemDto, userId, vendedorId) {
        return __awaiter(this, void 0, void 0, function () {
            var carrito, tipo, referenciaId, cantidad, precioUnitario, boletoExistente, funcion, dulceriaItem, item, nuevaExpiracion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, vendedorId)];
                    case 1:
                        carrito = _a.sent();
                        tipo = addItemDto.tipo, referenciaId = addItemDto.referenciaId, cantidad = addItemDto.cantidad, precioUnitario = addItemDto.precioUnitario;
                        if (!(tipo === 'BOLETO')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.prisma.boleto.findFirst({
                                where: {
                                    id: referenciaId,
                                    estado: { "in": ['RESERVADO', 'PAGADO'] }
                                }
                            })];
                    case 2:
                        boletoExistente = _a.sent();
                        if (boletoExistente) {
                            throw new common_1.BadRequestException('El asiento ya no está disponible');
                        }
                        return [4 /*yield*/, this.prisma.funcion.findUnique({
                                where: { id: (boletoExistente === null || boletoExistente === void 0 ? void 0 : boletoExistente.funcionId) || '' }
                            })];
                    case 3:
                        funcion = _a.sent();
                        if (funcion === null || funcion === void 0 ? void 0 : funcion.cancelada) {
                            throw new common_1.BadRequestException('La función está cancelada');
                        }
                        _a.label = 4;
                    case 4:
                        if (!(tipo === 'DULCERIA')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.dulceriaItem.findUnique({
                                where: { id: referenciaId }
                            })];
                    case 5:
                        dulceriaItem = _a.sent();
                        if (!dulceriaItem || !dulceriaItem.activo) {
                            throw new common_1.BadRequestException('El item de dulcería no está disponible');
                        }
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.prisma.carritoItem.create({
                            data: {
                                carritoId: id,
                                tipo: tipo,
                                referenciaId: referenciaId,
                                cantidad: cantidad,
                                precioUnitario: precioUnitario
                            }
                        })];
                    case 7:
                        item = _a.sent();
                        nuevaExpiracion = moment.tz('America/Mazatlan').add(carrito.tipo === 'CLIENTE' ? 10 : 30, 'minutes').toDate();
                        return [4 /*yield*/, this.prisma.carrito.update({
                                where: { id: id },
                                data: { expiracion: nuevaExpiracion }
                            })];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    CarritosService.prototype.updateItem = function (id, itemId, updateItemDto, userId, vendedorId) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, vendedorId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.prisma.carritoItem.update({
                                where: { id: itemId },
                                data: updateItemDto
                            })];
                    case 2:
                        item = _a.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    CarritosService.prototype.removeItem = function (id, itemId, userId, vendedorId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, vendedorId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.prisma.carritoItem["delete"]({
                                where: { id: itemId }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Item eliminado del carrito' }];
                }
            });
        });
    };
    CarritosService.prototype.remove = function (id, userId, vendedorId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id, userId, vendedorId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.prisma.carrito["delete"]({
                                where: { id: id }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Carrito eliminado exitosamente' }];
                }
            });
        });
    };
    CarritosService.prototype.getCarritoByUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.carrito.findFirst({
                        where: {
                            usuarioId: userId,
                            expiracion: { gt: new Date() }
                        },
                        include: {
                            items: true
                        },
                        orderBy: { createdAt: 'desc' }
                    })];
            });
        });
    };
    CarritosService.prototype.getCarritoByVendedor = function (vendedorId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.carrito.findFirst({
                        where: {
                            vendedorId: vendedorId,
                            expiracion: { gt: new Date() }
                        },
                        include: {
                            items: true
                        },
                        orderBy: { createdAt: 'desc' }
                    })];
            });
        });
    };
    CarritosService.prototype.limpiarCarritosExpirados = function () {
        return __awaiter(this, void 0, void 0, function () {
            var carritosExpirados, _i, carritosExpirados_1, carrito;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.carrito.findMany({
                            where: {
                                expiracion: { lt: new Date() }
                            }
                        })];
                    case 1:
                        carritosExpirados = _a.sent();
                        _i = 0, carritosExpirados_1 = carritosExpirados;
                        _a.label = 2;
                    case 2:
                        if (!(_i < carritosExpirados_1.length)) return [3 /*break*/, 5];
                        carrito = carritosExpirados_1[_i];
                        return [4 /*yield*/, this.prisma.carrito["delete"]({
                                where: { id: carrito.id }
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, { message: carritosExpirados.length + " carritos expirados eliminados" }];
                }
            });
        });
    };
    CarritosService.prototype.calcularTotal = function (carrito) {
        return carrito.items.reduce(function (sum, item) {
            return sum + (Number(item.precioUnitario) * item.cantidad);
        }, 0);
    };
    CarritosService = __decorate([
        common_1.Injectable()
    ], CarritosService);
    return CarritosService;
}());
exports.CarritosService = CarritosService;
