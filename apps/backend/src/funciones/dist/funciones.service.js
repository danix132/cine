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
exports.FuncionesService = void 0;
var common_1 = require("@nestjs/common");
var pagination_dto_1 = require("../common/dto/pagination.dto");
var moment = require("moment-timezone");
var FuncionesService = /** @class */ (function () {
    function FuncionesService(prisma) {
        this.prisma = prisma;
    }
    FuncionesService.prototype.create = function (createFuncionDto) {
        return __awaiter(this, void 0, void 0, function () {
            var peliculaId, salaId, inicio, precio, _a, forzarCreacion, pelicula, sala, inicioFuncion, finFuncion, funcionesExistentes, _b, conflictos, funcionesCercanas, salasOcupadas, solapamientos, mensaje, detalleSalaOcupada, detalleSolapamientos, detalleCercanas, mensaje, funcion;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        peliculaId = createFuncionDto.peliculaId, salaId = createFuncionDto.salaId, inicio = createFuncionDto.inicio, precio = createFuncionDto.precio, _a = createFuncionDto.forzarCreacion, forzarCreacion = _a === void 0 ? false : _a;
                        return [4 /*yield*/, this.prisma.pelicula.findUnique({
                                where: { id: peliculaId }
                            })];
                    case 1:
                        pelicula = _c.sent();
                        if (!pelicula) {
                            throw new common_1.NotFoundException('Película no encontrada');
                        }
                        if (pelicula.estado !== 'ACTIVA') {
                            throw new common_1.BadRequestException('Solo se pueden crear funciones para películas activas');
                        }
                        return [4 /*yield*/, this.prisma.sala.findUnique({
                                where: { id: salaId }
                            })];
                    case 2:
                        sala = _c.sent();
                        if (!sala) {
                            throw new common_1.NotFoundException('Sala no encontrada');
                        }
                        inicioFuncion = moment.tz(inicio, 'America/Mazatlan');
                        finFuncion = inicioFuncion.clone().add(pelicula.duracionMin + 30, 'minutes');
                        console.log("\uD83D\uDD0D Verificando conflictos para sala " + salaId + ":");
                        console.log("  Nueva funci\u00F3n: " + inicioFuncion.format() + " - " + finFuncion.format());
                        console.log("  Duraci\u00F3n pel\u00EDcula: " + pelicula.duracionMin + " minutos");
                        return [4 /*yield*/, this.prisma.funcion.findMany({
                                where: {
                                    salaId: salaId,
                                    cancelada: false
                                },
                                include: {
                                    pelicula: true
                                }
                            })];
                    case 3:
                        funcionesExistentes = _c.sent();
                        console.log("  Funciones existentes en sala: " + funcionesExistentes.length);
                        _b = this.analizarConflictosFunciones(funcionesExistentes, inicioFuncion, finFuncion), conflictos = _b.conflictos, funcionesCercanas = _b.funcionesCercanas;
                        // Primero verificar conflictos directos (errores que impiden crear)
                        if (conflictos.length > 0) {
                            salasOcupadas = conflictos.filter(function (c) { return c.tipo === 'SALA_OCUPADA'; });
                            solapamientos = conflictos.filter(function (c) { return c.tipo === 'SOLAPAMIENTO'; });
                            mensaje = '';
                            if (salasOcupadas.length > 0) {
                                detalleSalaOcupada = salasOcupadas.map(function (c) {
                                    return "\"" + c.pelicula + "\" ya programada en esta sala para " + c.inicio;
                                }).join(', ');
                                mensaje += "\uD83C\uDFAC SALA OCUPADA: " + detalleSalaOcupada + ". ";
                            }
                            if (solapamientos.length > 0) {
                                detalleSolapamientos = solapamientos.map(function (c) {
                                    return "\"" + c.pelicula + "\" (" + c.inicio + " - " + c.fin + ")";
                                }).join(', ');
                                mensaje += "\uD83D\uDD04 Funciones que se solapan: " + detalleSolapamientos + ". ";
                            }
                            mensaje += "Tu funci\u00F3n programada: " + inicioFuncion.format() + " - " + finFuncion.format();
                            throw new common_1.ConflictException(mensaje);
                        }
                        // Si no hay conflictos directos pero sí funciones cercanas, lanzar advertencia (a menos que se fuerce)
                        if (funcionesCercanas.length > 0 && !forzarCreacion) {
                            detalleCercanas = funcionesCercanas.map(function (c) {
                                return "\"" + c.pelicula + "\" (" + c.inicio + ") - Solo " + c.minutos + " minutos de separaci\u00F3n";
                            }).join(', ');
                            mensaje = "\u26A0\uFE0F ADVERTENCIA: Hay funciones muy cercanas: " + detalleCercanas + ". Se recomienda dejar al menos 60 minutos entre funciones para limpieza y cambio de audiencia. \u00BFDeseas continuar de todas formas?";
                            throw new common_1.BadRequestException(mensaje);
                        }
                        if (funcionesCercanas.length > 0 && forzarCreacion) {
                            console.log('⚠️ Creación forzada con funciones cercanas detectadas');
                        }
                        console.log("\u2705 No hay conflictos, creando funci\u00F3n...");
                        return [4 /*yield*/, this.prisma.funcion.create({
                                data: {
                                    peliculaId: peliculaId,
                                    salaId: salaId,
                                    inicio: inicioFuncion.toDate(),
                                    precio: precio
                                },
                                include: {
                                    pelicula: true,
                                    sala: true
                                }
                            })];
                    case 4:
                        funcion = _c.sent();
                        return [2 /*return*/, funcion];
                }
            });
        });
    };
    FuncionesService.prototype.debugConflictos = function (createFuncionDto) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var peliculaId, salaId, inicio, precio, pelicula, sala, inicioFuncion, finFuncion, funcionesExistentes, analisisConflictos, _i, funcionesExistentes_1, funcionExistente, inicioExistente, duracionExistente, finExistente, haySolapamiento;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        peliculaId = createFuncionDto.peliculaId, salaId = createFuncionDto.salaId, inicio = createFuncionDto.inicio, precio = createFuncionDto.precio;
                        console.log('🐛 === DEBUG DE CONFLICTOS ===');
                        console.log('Datos recibidos:', { peliculaId: peliculaId, salaId: salaId, inicio: inicio, precio: precio });
                        return [4 /*yield*/, this.prisma.pelicula.findUnique({
                                where: { id: peliculaId }
                            })];
                    case 1:
                        pelicula = _c.sent();
                        if (!pelicula) {
                            return [2 /*return*/, { error: 'Película no encontrada', pelicula: null }];
                        }
                        return [4 /*yield*/, this.prisma.sala.findUnique({
                                where: { id: salaId }
                            })];
                    case 2:
                        sala = _c.sent();
                        if (!sala) {
                            return [2 /*return*/, { error: 'Sala no encontrada', sala: null }];
                        }
                        inicioFuncion = moment.tz(inicio, 'America/Mazatlan');
                        finFuncion = inicioFuncion.clone().add(pelicula.duracionMin + 30, 'minutes');
                        return [4 /*yield*/, this.prisma.funcion.findMany({
                                where: {
                                    salaId: salaId,
                                    cancelada: false
                                },
                                include: {
                                    pelicula: true,
                                    sala: true
                                }
                            })];
                    case 3:
                        funcionesExistentes = _c.sent();
                        analisisConflictos = [];
                        for (_i = 0, funcionesExistentes_1 = funcionesExistentes; _i < funcionesExistentes_1.length; _i++) {
                            funcionExistente = funcionesExistentes_1[_i];
                            inicioExistente = moment(funcionExistente.inicio);
                            duracionExistente = ((_a = funcionExistente.pelicula) === null || _a === void 0 ? void 0 : _a.duracionMin) || 120;
                            finExistente = inicioExistente.clone().add(duracionExistente + 30, 'minutes');
                            haySolapamiento = inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente);
                            analisisConflictos.push({
                                funcionId: funcionExistente.id,
                                pelicula: (_b = funcionExistente.pelicula) === null || _b === void 0 ? void 0 : _b.titulo,
                                inicioExistente: inicioExistente.format(),
                                finExistente: finExistente.format(),
                                duracionExistente: duracionExistente,
                                haySolapamiento: haySolapamiento
                            });
                        }
                        return [2 /*return*/, {
                                datosNuevaFuncion: {
                                    pelicula: pelicula.titulo,
                                    sala: sala.nombre,
                                    inicio: inicioFuncion.format(),
                                    fin: finFuncion.format(),
                                    duracion: pelicula.duracionMin
                                },
                                funcionesExistentes: funcionesExistentes.length,
                                analisisConflictos: analisisConflictos,
                                hayConflictos: analisisConflictos.some(function (a) { return a.haySolapamiento; }),
                                mensaje: analisisConflictos.some(function (a) { return a.haySolapamiento; })
                                    ? 'Se detectaron conflictos'
                                    : 'No hay conflictos detectados'
                            }];
                }
            });
        });
    };
    FuncionesService.prototype.findAll = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, _c, search, peliculaId, salaId, desde, hasta, cancelada, skip, where, _d, funciones, total;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, _c = query.search, search = _c === void 0 ? '' : _c, peliculaId = query.peliculaId, salaId = query.salaId, desde = query.desde, hasta = query.hasta, cancelada = query.cancelada;
                        skip = (page - 1) * limit;
                        where = {};
                        if (search) {
                            where = {
                                OR: [
                                    { pelicula: { titulo: { contains: search, mode: 'insensitive' } } },
                                    { sala: { nombre: { contains: search, mode: 'insensitive' } } },
                                ]
                            };
                        }
                        if (peliculaId)
                            where.peliculaId = peliculaId;
                        if (salaId)
                            where.salaId = salaId;
                        if (cancelada !== undefined)
                            where.cancelada = cancelada;
                        if (desde)
                            where.inicio = { gte: new Date(desde) };
                        if (hasta)
                            where.inicio = __assign(__assign({}, where.inicio), { lte: new Date(hasta) });
                        return [4 /*yield*/, Promise.all([
                                this.prisma.funcion.findMany({
                                    where: where,
                                    include: {
                                        pelicula: { select: { id: true, titulo: true, posterUrl: true, duracionMin: true, generos: true, clasificacion: true } },
                                        sala: { select: { id: true, nombre: true, filas: true, asientosPorFila: true } },
                                        _count: { select: { boletos: true } }
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: { inicio: 'asc' }
                                }),
                                this.prisma.funcion.count({ where: where }),
                            ])];
                    case 1:
                        _d = _e.sent(), funciones = _d[0], total = _d[1];
                        return [2 /*return*/, pagination_dto_1.createPaginatedResponse(funciones, total, page, limit)];
                }
            });
        });
    };
    FuncionesService.prototype.findUpcoming = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.funcion.findMany({
                        where: {
                            inicio: { gt: new Date() },
                            cancelada: false
                        },
                        include: {
                            pelicula: true,
                            sala: true,
                            _count: {
                                select: {
                                    boletos: true
                                }
                            }
                        },
                        orderBy: { inicio: 'asc' }
                    })];
            });
        });
    };
    FuncionesService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var funcion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.funcion.findUnique({
                            where: { id: id },
                            include: {
                                pelicula: true,
                                sala: true,
                                boletos: {
                                    include: {
                                        asiento: true,
                                        usuario: true
                                    }
                                },
                                _count: {
                                    select: {
                                        boletos: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        funcion = _a.sent();
                        if (!funcion) {
                            throw new common_1.NotFoundException('Función no encontrada');
                        }
                        return [2 /*return*/, funcion];
                }
            });
        });
    };
    FuncionesService.prototype.update = function (id, updateFuncionDto) {
        return __awaiter(this, void 0, void 0, function () {
            var funcionExistente, cambiaHorario, cambiaSala, peliculaId, salaId, inicio, funcion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        funcionExistente = _a.sent();
                        cambiaHorario = updateFuncionDto.inicio &&
                            new Date(updateFuncionDto.inicio).getTime() !== new Date(funcionExistente.inicio).getTime();
                        cambiaSala = updateFuncionDto.salaId && updateFuncionDto.salaId !== funcionExistente.salaId;
                        if (!(cambiaHorario || cambiaSala)) return [3 /*break*/, 3];
                        console.log('🔍 Validando conflictos en actualización...');
                        console.log('  - Fecha anterior:', funcionExistente.inicio);
                        console.log('  - Fecha nueva:', updateFuncionDto.inicio);
                        console.log('  - Cambio de horario:', cambiaHorario);
                        console.log('  - Cambio de sala:', cambiaSala);
                        peliculaId = updateFuncionDto.peliculaId || funcionExistente.peliculaId;
                        salaId = updateFuncionDto.salaId || funcionExistente.salaId;
                        inicio = updateFuncionDto.inicio || funcionExistente.inicio.toISOString();
                        // Validar conflictos usando el mismo algoritmo que create, pero excluyendo la función actual
                        return [4 /*yield*/, this.validarConflictosParaActualizacion(id, peliculaId, salaId, inicio, updateFuncionDto.forzarActualizacion || false)];
                    case 2:
                        // Validar conflictos usando el mismo algoritmo que create, pero excluyendo la función actual
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.prisma.funcion.update({
                            where: { id: id },
                            data: updateFuncionDto,
                            include: {
                                pelicula: true,
                                sala: true
                            }
                        })];
                    case 4:
                        funcion = _a.sent();
                        return [2 /*return*/, funcion];
                }
            });
        });
    };
    FuncionesService.prototype.validarConflictosParaActualizacion = function (funcionId, peliculaId, salaId, inicio, forzarActualizacion) {
        var _a, _b, _c, _d;
        if (forzarActualizacion === void 0) { forzarActualizacion = false; }
        return __awaiter(this, void 0, void 0, function () {
            var pelicula, inicioFuncion, duracionMin, finFuncion, rangoInicio, rangoFin, funcionesExistentes, conflictos, funcionesCercanas, _i, funcionesExistentes_2, funcionExistente, inicioExistente, duracionExistente, finExistente, mismoHorario, haySolapamiento, minutosAntes, minutosDespues, estaRealmenteCerca, minutosSeparacion, salasOcupadas, solapamientos, mensaje, detalleSalaOcupada, detalleSolapamientos, detalleCercanas, mensaje;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.prisma.pelicula.findUnique({
                            where: { id: peliculaId }
                        })];
                    case 1:
                        pelicula = _e.sent();
                        if (!pelicula) {
                            throw new common_1.BadRequestException('Película no encontrada');
                        }
                        inicioFuncion = moment(inicio);
                        duracionMin = pelicula.duracionMin || 120;
                        finFuncion = inicioFuncion.clone().add(duracionMin + 30, 'minutes');
                        rangoInicio = inicioFuncion.clone().subtract(2, 'hours');
                        rangoFin = inicioFuncion.clone().add(2, 'hours');
                        console.log("  Validando funci\u00F3n actualizada: " + inicioFuncion.format() + " - " + finFuncion.format());
                        return [4 /*yield*/, this.prisma.funcion.findMany({
                                where: {
                                    salaId: salaId,
                                    cancelada: false,
                                    id: { not: funcionId },
                                    inicio: {
                                        gte: rangoInicio.toDate(),
                                        lte: rangoFin.toDate()
                                    }
                                },
                                include: {
                                    pelicula: { select: { titulo: true, duracionMin: true } }
                                }
                            })];
                    case 2:
                        funcionesExistentes = _e.sent();
                        console.log("  Funciones existentes en sala (excluyendo actual): " + funcionesExistentes.length);
                        conflictos = [];
                        funcionesCercanas = [];
                        for (_i = 0, funcionesExistentes_2 = funcionesExistentes; _i < funcionesExistentes_2.length; _i++) {
                            funcionExistente = funcionesExistentes_2[_i];
                            inicioExistente = moment(funcionExistente.inicio);
                            duracionExistente = ((_a = funcionExistente.pelicula) === null || _a === void 0 ? void 0 : _a.duracionMin) || 120;
                            finExistente = inicioExistente.clone().add(duracionExistente + 30, 'minutes');
                            console.log("    Analizando: " + inicioExistente.format() + " - " + finExistente.format());
                            mismoHorario = inicioFuncion.isSame(inicioExistente);
                            haySolapamiento = inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente);
                            minutosAntes = inicioFuncion.diff(finExistente, 'minutes');
                            minutosDespues = inicioExistente.diff(finFuncion, 'minutes');
                            estaRealmenteCerca = (minutosAntes >= 0 && minutosAntes < 60) || (minutosDespues >= 0 && minutosDespues < 60);
                            if (mismoHorario) {
                                console.log("    \u274C HORARIO ID\u00C9NTICO con funci\u00F3n " + funcionExistente.id);
                                conflictos.push({
                                    id: funcionExistente.id,
                                    inicio: inicioExistente.format(),
                                    fin: finExistente.format(),
                                    pelicula: (_b = funcionExistente.pelicula) === null || _b === void 0 ? void 0 : _b.titulo,
                                    tipo: 'HORARIO_IDENTICO'
                                });
                            }
                            else if (haySolapamiento) {
                                console.log("    \u274C SOLAPAMIENTO DIRECTO con funci\u00F3n " + funcionExistente.id);
                                conflictos.push({
                                    id: funcionExistente.id,
                                    inicio: inicioExistente.format(),
                                    fin: finExistente.format(),
                                    pelicula: (_c = funcionExistente.pelicula) === null || _c === void 0 ? void 0 : _c.titulo,
                                    tipo: 'SOLAPAMIENTO'
                                });
                            }
                            else if (estaRealmenteCerca) {
                                minutosSeparacion = Math.min(minutosAntes >= 0 ? minutosAntes : 999, minutosDespues >= 0 ? minutosDespues : 999);
                                console.log("    \u26A0\uFE0F FUNCI\u00D3N CERCA con funci\u00F3n " + funcionExistente.id + " (" + minutosSeparacion + " min de separaci\u00F3n)");
                                funcionesCercanas.push({
                                    id: funcionExistente.id,
                                    inicio: inicioExistente.format(),
                                    fin: finExistente.format(),
                                    pelicula: (_d = funcionExistente.pelicula) === null || _d === void 0 ? void 0 : _d.titulo,
                                    minutos: minutosSeparacion
                                });
                            }
                            else {
                                console.log("    \u2705 Sin problemas");
                            }
                        }
                        // Primero verificar conflictos directos (errores que impiden guardar)
                        if (conflictos.length > 0) {
                            salasOcupadas = conflictos.filter(function (c) { return c.tipo === 'SALA_OCUPADA'; });
                            solapamientos = conflictos.filter(function (c) { return c.tipo === 'SOLAPAMIENTO'; });
                            mensaje = 'Error al actualizar: ';
                            if (salasOcupadas.length > 0) {
                                detalleSalaOcupada = salasOcupadas.map(function (c) {
                                    return "\"" + c.pelicula + "\" ya ocupa esta sala en " + c.inicio;
                                }).join(', ');
                                mensaje += "\uD83C\uDFAC SALA OCUPADA: " + detalleSalaOcupada + ". ";
                            }
                            if (solapamientos.length > 0) {
                                detalleSolapamientos = solapamientos.map(function (c) {
                                    return "\"" + c.pelicula + "\" (" + c.inicio + " - " + c.fin + ")";
                                }).join(', ');
                                mensaje += "\uD83D\uDD04 Funciones que se solapan: " + detalleSolapamientos + ". ";
                            }
                            mensaje += "Nueva funci\u00F3n programada: " + inicioFuncion.format() + " - " + finFuncion.format();
                            throw new common_1.ConflictException(mensaje);
                        }
                        // Si no hay conflictos directos pero sí funciones cercanas, lanzar advertencia (a menos que se fuerce)
                        if (funcionesCercanas.length > 0 && !forzarActualizacion) {
                            detalleCercanas = funcionesCercanas.map(function (c) {
                                return "\"" + c.pelicula + "\" (" + c.inicio + ") - Solo " + c.minutos + " minutos de separaci\u00F3n";
                            }).join(', ');
                            mensaje = "\u26A0\uFE0F ADVERTENCIA: Hay funciones muy cercanas: " + detalleCercanas + ". Se recomienda dejar al menos 60 minutos entre funciones para limpieza y cambio de audiencia. \u00BFDeseas continuar de todas formas?";
                            // Usar status 400 para advertencias que requieren confirmación del usuario
                            throw new common_1.BadRequestException(mensaje);
                        }
                        if (funcionesCercanas.length > 0 && forzarActualizacion) {
                            console.log('⚠️ Actualización forzada con funciones cercanas detectadas');
                        }
                        console.log("\u2705 No hay conflictos para la actualizaci\u00F3n");
                        return [2 /*return*/];
                }
            });
        });
    };
    FuncionesService.prototype.analizarConflictosFunciones = function (funcionesExistentes, inicioFuncion, finFuncion) {
        var _a, _b, _c, _d, _e, _f;
        var conflictos = [];
        var funcionesCercanas = [];
        for (var _i = 0, funcionesExistentes_3 = funcionesExistentes; _i < funcionesExistentes_3.length; _i++) {
            var funcionExistente = funcionesExistentes_3[_i];
            var inicioExistente = moment(funcionExistente.inicio);
            var duracionExistente = ((_a = funcionExistente.pelicula) === null || _a === void 0 ? void 0 : _a.duracionMin) || 120;
            var finExistente = inicioExistente.clone().add(duracionExistente + 30, 'minutes'); // Buffer de 30 min
            console.log("    Analizando: " + inicioExistente.format() + " - " + finExistente.format() + " - \"" + ((_b = funcionExistente.pelicula) === null || _b === void 0 ? void 0 : _b.titulo) + "\"");
            // Verificar si es exactamente el mismo horario
            var mismoHorario = inicioFuncion.isSame(inicioExistente);
            // Verificar si hay solapamiento directo
            var haySolapamiento = inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente);
            // Verificar si está cerca (menos de 60 minutos de diferencia)
            var minutosAntes = inicioFuncion.diff(finExistente, 'minutes');
            var minutosDespues = inicioExistente.diff(finFuncion, 'minutes');
            var estaRealmenteCerca = (minutosAntes >= 0 && minutosAntes < 60) || (minutosDespues >= 0 && minutosDespues < 60);
            if (mismoHorario) {
                console.log("    \u274C SALA OCUPADA: \"" + ((_c = funcionExistente.pelicula) === null || _c === void 0 ? void 0 : _c.titulo) + "\" ya programada en mismo horario");
                conflictos.push({
                    id: funcionExistente.id,
                    inicio: inicioExistente.format(),
                    fin: finExistente.format(),
                    pelicula: (_d = funcionExistente.pelicula) === null || _d === void 0 ? void 0 : _d.titulo,
                    peliculaId: funcionExistente.peliculaId,
                    tipo: 'SALA_OCUPADA'
                });
            }
            else if (haySolapamiento) {
                console.log("    \u274C SOLAPAMIENTO DIRECTO con funci\u00F3n " + funcionExistente.id);
                conflictos.push({
                    id: funcionExistente.id,
                    inicio: inicioExistente.format(),
                    fin: finExistente.format(),
                    pelicula: (_e = funcionExistente.pelicula) === null || _e === void 0 ? void 0 : _e.titulo,
                    tipo: 'SOLAPAMIENTO'
                });
            }
            else if (estaRealmenteCerca) {
                var minutosSeparacion = Math.min(minutosAntes >= 0 ? minutosAntes : 999, minutosDespues >= 0 ? minutosDespues : 999);
                console.log("    \u26A0\uFE0F FUNCI\u00D3N CERCA con funci\u00F3n " + funcionExistente.id + " (" + minutosSeparacion + " min de separaci\u00F3n)");
                funcionesCercanas.push({
                    id: funcionExistente.id,
                    inicio: inicioExistente.format(),
                    fin: finExistente.format(),
                    pelicula: (_f = funcionExistente.pelicula) === null || _f === void 0 ? void 0 : _f.titulo,
                    minutos: minutosSeparacion
                });
            }
            else {
                console.log("    \u2705 Sin problemas");
            }
        }
        return { conflictos: conflictos, funcionesCercanas: funcionesCercanas };
    };
    FuncionesService.prototype.cancelar = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var funcion, boletosPagados, funcionCancelada;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        funcion = _a.sent();
                        if (funcion.cancelada) {
                            throw new common_1.BadRequestException('La función ya está cancelada');
                        }
                        return [4 /*yield*/, this.prisma.boleto.findFirst({
                                where: {
                                    funcionId: id,
                                    estado: 'PAGADO'
                                }
                            })];
                    case 2:
                        boletosPagados = _a.sent();
                        if (boletosPagados) {
                            throw new common_1.BadRequestException('No se puede cancelar una función con boletos pagados');
                        }
                        return [4 /*yield*/, this.prisma.funcion.update({
                                where: { id: id },
                                data: { cancelada: true },
                                include: {
                                    pelicula: true,
                                    sala: true
                                }
                            })];
                    case 3:
                        funcionCancelada = _a.sent();
                        return [2 /*return*/, { message: 'Función cancelada exitosamente', funcion: funcionCancelada }];
                }
            });
        });
    };
    FuncionesService.prototype.reactivar = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var funcion, pelicula, inicioFuncion, finFuncion, funcionesExistentes, _i, funcionesExistentes_4, funcionExistente, inicioExistente, finExistente, funcionReactivada;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        funcion = _a.sent();
                        if (!funcion.cancelada) {
                            throw new common_1.BadRequestException('La función ya está activa');
                        }
                        return [4 /*yield*/, this.prisma.pelicula.findUnique({
                                where: { id: funcion.peliculaId }
                            })];
                    case 2:
                        pelicula = _a.sent();
                        if (!pelicula) {
                            throw new common_1.NotFoundException('Película no encontrada');
                        }
                        inicioFuncion = moment.tz(funcion.inicio, 'America/Mazatlan');
                        finFuncion = inicioFuncion.clone().add(pelicula.duracionMin + 30, 'minutes');
                        return [4 /*yield*/, this.prisma.funcion.findMany({
                                where: {
                                    salaId: funcion.salaId,
                                    cancelada: false,
                                    id: { not: id }
                                },
                                include: {
                                    pelicula: true
                                }
                            })];
                    case 3:
                        funcionesExistentes = _a.sent();
                        for (_i = 0, funcionesExistentes_4 = funcionesExistentes; _i < funcionesExistentes_4.length; _i++) {
                            funcionExistente = funcionesExistentes_4[_i];
                            inicioExistente = moment.tz(funcionExistente.inicio, 'America/Mazatlan');
                            finExistente = inicioExistente.clone().add(funcionExistente.pelicula.duracionMin + 30, 'minutes');
                            if ((inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente))) {
                                throw new common_1.ConflictException("Conflicto de horario con funci\u00F3n existente. " +
                                    ("Funci\u00F3n existente: " + inicioExistente.format('DD/MM/YYYY HH:mm') + " - " + finExistente.format('HH:mm')));
                            }
                        }
                        return [4 /*yield*/, this.prisma.funcion.update({
                                where: { id: id },
                                data: { cancelada: false },
                                include: {
                                    pelicula: true,
                                    sala: true
                                }
                            })];
                    case 4:
                        funcionReactivada = _a.sent();
                        return [2 /*return*/, { message: 'Función reactivada exitosamente', funcion: funcionReactivada }];
                }
            });
        });
    };
    FuncionesService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var boletosVendidos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar si la función existe
                    return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        // Verificar si la función existe
                        _a.sent();
                        return [4 /*yield*/, this.prisma.boleto.findFirst({
                                where: { funcionId: id }
                            })];
                    case 2:
                        boletosVendidos = _a.sent();
                        if (boletosVendidos) {
                            throw new common_1.BadRequestException('No se puede eliminar una función con boletos vendidos');
                        }
                        return [4 /*yield*/, this.prisma.funcion["delete"]({
                                where: { id: id }
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: 'Función eliminada exitosamente' }];
                }
            });
        });
    };
    FuncionesService.prototype.findByPelicula = function (peliculaId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.funcion.findMany({
                        where: {
                            peliculaId: peliculaId,
                            inicio: { gt: new Date() },
                            cancelada: false
                        },
                        include: {
                            sala: true,
                            _count: {
                                select: {
                                    boletos: true
                                }
                            }
                        },
                        orderBy: { inicio: 'asc' }
                    })];
            });
        });
    };
    FuncionesService.prototype.findBySala = function (salaId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.funcion.findMany({
                        where: {
                            salaId: salaId,
                            inicio: { gt: new Date() },
                            cancelada: false
                        },
                        include: {
                            pelicula: true,
                            _count: {
                                select: {
                                    boletos: true
                                }
                            }
                        },
                        orderBy: { inicio: 'asc' }
                    })];
            });
        });
    };
    FuncionesService = __decorate([
        common_1.Injectable()
    ], FuncionesService);
    return FuncionesService;
}());
exports.FuncionesService = FuncionesService;
