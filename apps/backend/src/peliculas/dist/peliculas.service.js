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
exports.PeliculasService = void 0;
var common_1 = require("@nestjs/common");
var pagination_dto_1 = require("../common/dto/pagination.dto");
var PeliculasService = /** @class */ (function () {
    function PeliculasService(prisma) {
        this.prisma = prisma;
    }
    PeliculasService.prototype.create = function (createPeliculaDto) {
        return __awaiter(this, void 0, void 0, function () {
            var pelicula;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.pelicula.create({
                            data: createPeliculaDto
                        })];
                    case 1:
                        pelicula = _a.sent();
                        return [2 /*return*/, pelicula];
                }
            });
        });
    };
    PeliculasService.prototype.findAll = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, _c, search, estado, genero, skip, where, _d, peliculas, total;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, _c = query.search, search = _c === void 0 ? '' : _c, estado = query.estado, genero = query.genero;
                        skip = (page - 1) * limit;
                        where = {};
                        if (search) {
                            where = {
                                OR: [
                                    { titulo: { contains: search, mode: 'insensitive' } },
                                    { sinopsis: { contains: search, mode: 'insensitive' } },
                                    { generos: { hasSome: [search] } },
                                ]
                            };
                        }
                        if (estado)
                            where.estado = estado;
                        if (genero)
                            where.generos = { hasSome: [genero] };
                        return [4 /*yield*/, Promise.all([
                                this.prisma.pelicula.findMany({
                                    where: where,
                                    include: {
                                        _count: { select: { funciones: true } }
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: { titulo: 'asc' }
                                }),
                                this.prisma.pelicula.count({ where: where }),
                            ])];
                    case 1:
                        _d = _e.sent(), peliculas = _d[0], total = _d[1];
                        return [2 /*return*/, pagination_dto_1.createPaginatedResponse(peliculas, total, page, limit)];
                }
            });
        });
    };
    PeliculasService.prototype.findActive = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.pelicula.findMany({
                        where: { estado: 'ACTIVA' },
                        include: {
                            funciones: {
                                where: {
                                    inicio: { gt: new Date() },
                                    cancelada: false
                                },
                                include: {
                                    sala: true
                                },
                                orderBy: { inicio: 'asc' }
                            }
                        },
                        orderBy: { titulo: 'asc' }
                    })];
            });
        });
    };
    PeliculasService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var pelicula;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.pelicula.findUnique({
                            where: { id: id },
                            include: {
                                funciones: {
                                    where: {
                                        cancelada: false
                                    },
                                    include: {
                                        sala: true
                                    },
                                    orderBy: { inicio: 'asc' }
                                },
                                _count: {
                                    select: {
                                        funciones: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        pelicula = _a.sent();
                        if (!pelicula) {
                            throw new common_1.NotFoundException('Película no encontrada');
                        }
                        return [2 /*return*/, pelicula];
                }
            });
        });
    };
    PeliculasService.prototype.update = function (id, updatePeliculaDto) {
        return __awaiter(this, void 0, void 0, function () {
            var pelicula;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar si la película existe
                    return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        // Verificar si la película existe
                        _a.sent();
                        return [4 /*yield*/, this.prisma.pelicula.update({
                                where: { id: id },
                                data: updatePeliculaDto
                            })];
                    case 2:
                        pelicula = _a.sent();
                        return [2 /*return*/, pelicula];
                }
            });
        });
    };
    PeliculasService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var peliculaExistente, totalFunciones, funcionesProgramadas, boletosVendidos, razon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        peliculaExistente = _a.sent();
                        return [4 /*yield*/, this.prisma.funcion.count({
                                where: { peliculaId: id }
                            })];
                    case 2:
                        totalFunciones = _a.sent();
                        return [4 /*yield*/, this.prisma.funcion.count({
                                where: {
                                    peliculaId: id,
                                    inicio: { gt: new Date() },
                                    cancelada: false
                                }
                            })];
                    case 3:
                        funcionesProgramadas = _a.sent();
                        return [4 /*yield*/, this.prisma.boleto.count({
                                where: {
                                    funcion: { peliculaId: id },
                                    estado: { "in": ['RESERVADO', 'PAGADO'] }
                                }
                            })];
                    case 4:
                        boletosVendidos = _a.sent();
                        console.log("Eliminando pel\u00EDcula " + id + ":", {
                            peliculaId: id,
                            titulo: peliculaExistente.titulo,
                            totalFunciones: totalFunciones,
                            funcionesProgramadas: funcionesProgramadas,
                            boletosVendidos: boletosVendidos,
                            estadoActual: peliculaExistente.estado
                        });
                        // Si tiene boletos vendidos o funciones programadas, no se puede eliminar completamente
                        if (boletosVendidos > 0 || funcionesProgramadas > 0) {
                            razon = [];
                            if (boletosVendidos > 0)
                                razon.push(boletosVendidos + " boleto(s) vendido(s)");
                            if (funcionesProgramadas > 0)
                                razon.push(funcionesProgramadas + " funci\u00F3n(es) programada(s)");
                            throw new common_1.BadRequestException("No se puede eliminar completamente la pel\u00EDcula \"" + peliculaExistente.titulo + "\" porque tiene " + razon.join(' y ') + ".");
                        }
                        if (!(totalFunciones === 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.prisma.pelicula["delete"]({
                                where: { id: id }
                            })];
                    case 5:
                        _a.sent();
                        console.log("\uD83D\uDDD1\uFE0F Pel\u00EDcula \"" + peliculaExistente.titulo + "\" eliminada COMPLETAMENTE de la base de datos");
                        return [2 /*return*/, {
                                message: "Pel\u00EDcula \"" + peliculaExistente.titulo + "\" eliminada COMPLETAMENTE de la base de datos",
                                eliminacionCompleta: true
                            }];
                    case 6: 
                    // Si tiene funciones pasadas pero sin boletos ni funciones futuras, también eliminar completamente
                    // Primero eliminar las funciones pasadas
                    return [4 /*yield*/, this.prisma.funcion.deleteMany({
                            where: { peliculaId: id }
                        })];
                    case 7:
                        // Si tiene funciones pasadas pero sin boletos ni funciones futuras, también eliminar completamente
                        // Primero eliminar las funciones pasadas
                        _a.sent();
                        // Luego eliminar la película
                        return [4 /*yield*/, this.prisma.pelicula["delete"]({
                                where: { id: id }
                            })];
                    case 8:
                        // Luego eliminar la película
                        _a.sent();
                        console.log("\uD83D\uDDD1\uFE0F Pel\u00EDcula \"" + peliculaExistente.titulo + "\" y sus " + totalFunciones + " funci\u00F3n(es) pasada(s) eliminadas COMPLETAMENTE");
                        return [2 /*return*/, {
                                message: "Pel\u00EDcula \"" + peliculaExistente.titulo + "\" eliminada COMPLETAMENTE junto con " + totalFunciones + " funci\u00F3n(es) pasada(s)",
                                eliminacionCompleta: true,
                                funcionesEliminadas: totalFunciones
                            }];
                }
            });
        });
    };
    PeliculasService.prototype.forceRemove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var peliculaExistente, resultado;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        peliculaExistente = _a.sent();
                        console.log("\uD83D\uDEA8 ELIMINACI\u00D3N FORZADA - Pel\u00EDcula " + id + ":", {
                            peliculaId: id,
                            titulo: peliculaExistente.titulo,
                            warning: 'ELIMINACIÓN COMPLETA INCLUYENDO TODOS LOS DATOS RELACIONADOS'
                        });
                        return [4 /*yield*/, this.prisma.$transaction(function (prisma) { return __awaiter(_this, void 0, void 0, function () {
                                var boletosRelacionados, idsBoletosRelacionados, itemsCarritoEliminados, itemsPedidoEliminados;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, prisma.boleto.findMany({
                                                where: { funcion: { peliculaId: id } },
                                                select: { id: true }
                                            })];
                                        case 1:
                                            boletosRelacionados = _a.sent();
                                            idsBoletosRelacionados = boletosRelacionados.map(function (b) { return b.id; });
                                            return [4 /*yield*/, prisma.carritoItem.deleteMany({
                                                    where: {
                                                        tipo: 'BOLETO',
                                                        referenciaId: { "in": idsBoletosRelacionados }
                                                    }
                                                })];
                                        case 2:
                                            itemsCarritoEliminados = _a.sent();
                                            return [4 /*yield*/, prisma.pedidoItem.deleteMany({
                                                    where: {
                                                        tipo: 'BOLETO',
                                                        referenciaId: { "in": idsBoletosRelacionados }
                                                    }
                                                })];
                                        case 3:
                                            itemsPedidoEliminados = _a.sent();
                                            // 4. Los boletos se eliminan automáticamente por CASCADE cuando eliminamos las funciones
                                            // 5. Las funciones se eliminan automáticamente por CASCADE cuando eliminamos la película
                                            // 6. Finalmente eliminar la película (esto eliminará funciones y boletos por CASCADE)
                                            return [4 /*yield*/, prisma.pelicula["delete"]({
                                                    where: { id: id }
                                                })];
                                        case 4:
                                            // 4. Los boletos se eliminan automáticamente por CASCADE cuando eliminamos las funciones
                                            // 5. Las funciones se eliminan automáticamente por CASCADE cuando eliminamos la película
                                            // 6. Finalmente eliminar la película (esto eliminará funciones y boletos por CASCADE)
                                            _a.sent();
                                            return [2 /*return*/, {
                                                    boletosAfectados: idsBoletosRelacionados.length,
                                                    itemsCarritoEliminados: itemsCarritoEliminados.count,
                                                    itemsPedidoEliminados: itemsPedidoEliminados.count
                                                }];
                                    }
                                });
                            }); })];
                    case 2:
                        resultado = _a.sent();
                        console.log("\uD83D\uDDD1\uFE0F ELIMINACI\u00D3N FORZADA COMPLETADA - Pel\u00EDcula \"" + peliculaExistente.titulo + "\":", resultado);
                        return [2 /*return*/, {
                                message: "\uD83D\uDEA8 Pel\u00EDcula \"" + peliculaExistente.titulo + "\" ELIMINADA COMPLETAMENTE DE LA BASE DE DATOS",
                                eliminacionForzada: true,
                                titulo: peliculaExistente.titulo,
                                datosEliminados: resultado
                            }];
                }
            });
        });
    };
    PeliculasService.prototype.findByGenero = function (genero) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.pelicula.findMany({
                        where: {
                            generos: { has: genero },
                            estado: 'ACTIVA'
                        },
                        include: {
                            funciones: {
                                where: {
                                    inicio: { gt: new Date() },
                                    cancelada: false
                                },
                                include: {
                                    sala: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    PeliculasService = __decorate([
        common_1.Injectable()
    ], PeliculasService);
    return PeliculasService;
}());
exports.PeliculasService = PeliculasService;
