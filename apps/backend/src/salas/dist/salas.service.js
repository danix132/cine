"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SalasService = void 0;
var common_1 = require("@nestjs/common");
var pagination_dto_1 = require("../common/dto/pagination.dto");
var SalasService = /** @class */ (function () {
    function SalasService(prisma) {
        this.prisma = prisma;
    }
    SalasService.prototype.create = function (createSalaDto) {
        return __awaiter(this, void 0, void 0, function () {
            var nombre, filas, asientosPorFila, sala, asientos, fila, numero;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nombre = createSalaDto.nombre, filas = createSalaDto.filas, asientosPorFila = createSalaDto.asientosPorFila;
                        return [4 /*yield*/, this.prisma.sala.create({
                                data: {
                                    nombre: nombre,
                                    filas: filas,
                                    asientosPorFila: asientosPorFila
                                }
                            })];
                    case 1:
                        sala = _a.sent();
                        asientos = [];
                        for (fila = 1; fila <= filas; fila++) {
                            for (numero = 1; numero <= asientosPorFila; numero++) {
                                asientos.push({
                                    salaId: sala.id,
                                    fila: fila,
                                    numero: numero,
                                    estado: 'DISPONIBLE'
                                });
                            }
                        }
                        // Crear todos los asientos en batch
                        return [4 /*yield*/, this.prisma.asiento.createMany({
                                data: asientos
                            })];
                    case 2:
                        // Crear todos los asientos en batch
                        _a.sent();
                        return [2 /*return*/, sala];
                }
            });
        });
    };
    SalasService.prototype.findAll = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, _c, search, skip, where, _d, salas, total;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, _c = query.search, search = _c === void 0 ? '' : _c;
                        skip = (page - 1) * limit;
                        where = {};
                        if (search) {
                            where = {
                                nombre: { contains: search, mode: 'insensitive' }
                            };
                        }
                        return [4 /*yield*/, Promise.all([
                                this.prisma.sala.findMany({
                                    where: where,
                                    include: {
                                        _count: {
                                            select: {
                                                asientos: true,
                                                funciones: true
                                            }
                                        },
                                        asientos: {
                                            where: {
                                                estado: 'DANADO'
                                            },
                                            select: {
                                                id: true,
                                                fila: true,
                                                numero: true,
                                                estado: true
                                            }
                                        }
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: { nombre: 'asc' }
                                }),
                                this.prisma.sala.count({ where: where }),
                            ])];
                    case 1:
                        _d = _e.sent(), salas = _d[0], total = _d[1];
                        return [2 /*return*/, pagination_dto_1.createPaginatedResponse(salas, total, page, limit)];
                }
            });
        });
    };
    SalasService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sala;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.sala.findUnique({
                            where: { id: id },
                            include: {
                                asientos: {
                                    orderBy: [
                                        { fila: 'asc' },
                                        { numero: 'asc' },
                                    ]
                                },
                                _count: {
                                    select: {
                                        asientos: true,
                                        funciones: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        sala = _a.sent();
                        if (!sala) {
                            throw new common_1.NotFoundException('Sala no encontrada');
                        }
                        return [2 /*return*/, sala];
                }
            });
        });
    };
    SalasService.prototype.update = function (id, updateSalaDto) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var updateData, salaExistente, nuevasFilas, nuevosAsientosPorFila, funcionesProgramadas, asientos, fila, numero, sala;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('🏢 SalasService.update - Recibido:', { id: id, updateSalaDto: updateSalaDto });
                        console.log('🏢 Tipos de datos recibidos:', {
                            nombre: typeof updateSalaDto.nombre,
                            filas: typeof updateSalaDto.filas,
                            asientosPorFila: typeof updateSalaDto.asientosPorFila,
                            filasValue: updateSalaDto.filas,
                            asientosPorFilaValue: updateSalaDto.asientosPorFila
                        });
                        updateData = {};
                        // Agregar campos si están presentes
                        if (updateSalaDto.nombre !== undefined)
                            updateData.nombre = updateSalaDto.nombre;
                        if (updateSalaDto.filas !== undefined)
                            updateData.filas = updateSalaDto.filas;
                        if (updateSalaDto.asientosPorFila !== undefined)
                            updateData.asientosPorFila = updateSalaDto.asientosPorFila;
                        console.log('🏢 Datos preparados para actualizar:', updateData);
                        return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        salaExistente = _c.sent();
                        console.log('🏢 Sala existente encontrada:', salaExistente);
                        if (!(updateSalaDto.filas !== undefined || updateSalaDto.asientosPorFila !== undefined)) return [3 /*break*/, 5];
                        nuevasFilas = (_a = updateSalaDto.filas) !== null && _a !== void 0 ? _a : salaExistente.filas;
                        nuevosAsientosPorFila = (_b = updateSalaDto.asientosPorFila) !== null && _b !== void 0 ? _b : salaExistente.asientosPorFila;
                        console.log('🏢 Actualizando dimensiones:', { nuevasFilas: nuevasFilas, nuevosAsientosPorFila: nuevosAsientosPorFila });
                        return [4 /*yield*/, this.prisma.funcion.findFirst({
                                where: {
                                    salaId: id,
                                    inicio: { gt: new Date() }
                                }
                            })];
                    case 2:
                        funcionesProgramadas = _c.sent();
                        if (funcionesProgramadas) {
                            throw new common_1.BadRequestException('No se puede modificar una sala con funciones programadas');
                        }
                        // Eliminar asientos existentes
                        return [4 /*yield*/, this.prisma.asiento.deleteMany({
                                where: { salaId: id }
                            })];
                    case 3:
                        // Eliminar asientos existentes
                        _c.sent();
                        asientos = [];
                        for (fila = 1; fila <= nuevasFilas; fila++) {
                            for (numero = 1; numero <= nuevosAsientosPorFila; numero++) {
                                asientos.push({
                                    salaId: id,
                                    fila: fila,
                                    numero: numero,
                                    estado: 'DISPONIBLE'
                                });
                            }
                        }
                        // Crear nuevos asientos
                        return [4 /*yield*/, this.prisma.asiento.createMany({
                                data: asientos
                            })];
                    case 4:
                        // Crear nuevos asientos
                        _c.sent();
                        // Agregar filas y asientosPorFila al updateData
                        updateData.filas = nuevasFilas;
                        updateData.asientosPorFila = nuevosAsientosPorFila;
                        return [3 /*break*/, 6];
                    case 5:
                        // Si no se cambian las dimensiones, pero se incluyen en el DTO, agregarlas  
                        console.log('🏢 No se regeneran asientos, solo se actualizan campos');
                        _c.label = 6;
                    case 6:
                        console.log('🏢 Datos a actualizar:', updateData);
                        return [4 /*yield*/, this.prisma.sala.update({
                                where: { id: id },
                                data: updateData
                            })];
                    case 7:
                        sala = _c.sent();
                        console.log('🏢 Sala actualizada:', sala);
                        return [2 /*return*/, sala];
                }
            });
        });
    };
    SalasService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var funcionesProgramadas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar si la sala existe
                    return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        // Verificar si la sala existe
                        _a.sent();
                        return [4 /*yield*/, this.prisma.funcion.findFirst({
                                where: {
                                    salaId: id,
                                    inicio: { gt: new Date() }
                                }
                            })];
                    case 2:
                        funcionesProgramadas = _a.sent();
                        if (funcionesProgramadas) {
                            throw new common_1.BadRequestException('No se puede eliminar una sala con funciones programadas');
                        }
                        // Eliminar la sala (los asientos se eliminan en cascade)
                        return [4 /*yield*/, this.prisma.sala["delete"]({
                                where: { id: id }
                            })];
                    case 3:
                        // Eliminar la sala (los asientos se eliminan en cascade)
                        _a.sent();
                        return [2 /*return*/, { message: 'Sala eliminada exitosamente' }];
                }
            });
        });
    };
    SalasService.prototype.updateAsientosDanados = function (id, updateAsientosDanadosDto) {
        return __awaiter(this, void 0, void 0, function () {
            var asientosDanados, sala, _i, asientosDanados_1, asiento, resultado, asientosFinales, asientosDanadosFinales;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        asientosDanados = updateAsientosDanadosDto.asientosDanados;
                        console.log('🔧 Actualizando asientos dañados para sala:', id);
                        console.log('🔧 Asientos a marcar como dañados:', asientosDanados);
                        return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        sala = _a.sent();
                        // PASO 1: Marcar TODOS los asientos de la sala como DISPONIBLES
                        console.log('🔧 Paso 1: Restaurando todos los asientos a DISPONIBLE');
                        return [4 /*yield*/, this.prisma.asiento.updateMany({
                                where: {
                                    salaId: id
                                },
                                data: {
                                    estado: 'DISPONIBLE'
                                }
                            })];
                    case 2:
                        _a.sent();
                        if (!(asientosDanados && asientosDanados.length > 0)) return [3 /*break*/, 6];
                        console.log('🔧 Paso 2: Marcando asientos específicos como DAÑADOS');
                        _i = 0, asientosDanados_1 = asientosDanados;
                        _a.label = 3;
                    case 3:
                        if (!(_i < asientosDanados_1.length)) return [3 /*break*/, 6];
                        asiento = asientosDanados_1[_i];
                        console.log("\uD83D\uDD27 Marcando como da\u00F1ado: Fila " + asiento.fila + ", Asiento " + asiento.numero);
                        return [4 /*yield*/, this.prisma.asiento.updateMany({
                                where: {
                                    salaId: id,
                                    fila: asiento.fila,
                                    numero: asiento.numero
                                },
                                data: {
                                    estado: 'DANADO'
                                }
                            })];
                    case 4:
                        resultado = _a.sent();
                        console.log("\uD83D\uDD27 Resultado actualizaci\u00F3n: " + resultado.count + " asiento(s) actualizados");
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, this.prisma.asiento.findMany({
                            where: { salaId: id },
                            select: { fila: true, numero: true, estado: true }
                        })];
                    case 7:
                        asientosFinales = _a.sent();
                        asientosDanadosFinales = asientosFinales.filter(function (a) { return a.estado === 'DANADO'; });
                        console.log('🔧 Estado final - Total asientos dañados:', asientosDanadosFinales.length);
                        console.log('🔧 Asientos dañados finales:', asientosDanadosFinales);
                        return [2 /*return*/, {
                                message: 'Asientos dañados actualizados exitosamente',
                                asientosDanadosCount: asientosDanadosFinales.length,
                                asientosDanados: asientosDanadosFinales
                            }];
                }
            });
        });
    };
    SalasService.prototype.getAsientosDisponibilidad = function (salaId, funcionId) {
        return __awaiter(this, void 0, void 0, function () {
            var sala, asientosOcupados, asientosOcupadosIds, asientosConEstado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(salaId)];
                    case 1:
                        sala = _a.sent();
                        return [4 /*yield*/, this.prisma.boleto.findMany({
                                where: {
                                    funcionId: funcionId,
                                    estado: { "in": ['RESERVADO', 'PAGADO'] }
                                },
                                select: {
                                    asientoId: true
                                }
                            })];
                    case 2:
                        asientosOcupados = _a.sent();
                        asientosOcupadosIds = asientosOcupados.map(function (b) { return b.asientoId; });
                        asientosConEstado = sala.asientos.map(function (asiento) { return (__assign(__assign({}, asiento), { disponible: !asientosOcupadosIds.includes(asiento.id) && asiento.estado === 'DISPONIBLE' })); });
                        return [2 /*return*/, asientosConEstado];
                }
            });
        });
    };
    SalasService = __decorate([
        common_1.Injectable()
    ], SalasService);
    return SalasService;
}());
exports.SalasService = SalasService;
