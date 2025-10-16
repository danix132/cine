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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ReportesService = void 0;
var common_1 = require("@nestjs/common");
var ReportesService = /** @class */ (function () {
    function ReportesService(prisma) {
        this.prisma = prisma;
    }
    ReportesService.prototype.reporteVentas = function (desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            var ventas, totalVentas, cantidadPedidos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔍 REPORTES: Generando reporte de ventas');
                        console.log('📅 REPORTES: Período solicitado:', { desde: desde, hasta: hasta });
                        console.log('📅 REPORTES: Fecha actual del sistema:', new Date());
                        return [4 /*yield*/, this.prisma.pedido.findMany({
                                where: {
                                    createdAt: {
                                        gte: desde,
                                        lte: hasta
                                    }
                                },
                                include: {
                                    usuario: { select: { nombre: true, email: true } },
                                    vendedor: { select: { nombre: true, email: true } },
                                    items: true
                                },
                                orderBy: { createdAt: 'desc' }
                            })];
                    case 1:
                        ventas = _a.sent();
                        totalVentas = ventas.reduce(function (sum, pedido) { return sum + Number(pedido.total); }, 0);
                        cantidadPedidos = ventas.length;
                        console.log("\uD83D\uDCCA REPORTES: Encontradas " + cantidadPedidos + " ventas en el per\u00EDodo");
                        console.log('💰 REPORTES: Total de ventas:', totalVentas);
                        if (ventas.length > 0) {
                            console.log('🔍 REPORTES: Primeras ventas encontradas:', ventas.slice(0, 3).map(function (v) {
                                var _a;
                                return ({
                                    id: v.id,
                                    createdAt: v.createdAt,
                                    total: v.total,
                                    vendedor: ((_a = v.vendedor) === null || _a === void 0 ? void 0 : _a.nombre) || 'Sin vendedor'
                                });
                            }));
                        }
                        return [2 /*return*/, {
                                periodo: { desde: desde, hasta: hasta },
                                totalVentas: totalVentas,
                                cantidadPedidos: cantidadPedidos,
                                ventas: ventas
                            }];
                }
            });
        });
    };
    ReportesService.prototype.reporteOcupacion = function (desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            var funciones, ocupacionPorFuncion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.funcion.findMany({
                            where: {
                                inicio: {
                                    gte: desde,
                                    lte: hasta
                                },
                                cancelada: false
                            },
                            include: {
                                pelicula: { select: { titulo: true } },
                                sala: { select: { nombre: true, filas: true, asientosPorFila: true } },
                                _count: { select: { boletos: true } }
                            }
                        })];
                    case 1:
                        funciones = _a.sent();
                        ocupacionPorFuncion = funciones.map(function (funcion) {
                            var totalAsientos = funcion.sala.filas * funcion.sala.asientosPorFila;
                            var asientosOcupados = funcion._count.boletos;
                            var porcentajeOcupacion = (asientosOcupados / totalAsientos) * 100;
                            return {
                                funcionId: funcion.id,
                                pelicula: funcion.pelicula.titulo,
                                sala: funcion.sala.nombre,
                                inicio: funcion.inicio,
                                totalAsientos: totalAsientos,
                                asientosOcupados: asientosOcupados,
                                porcentajeOcupacion: Math.round(porcentajeOcupacion * 100) / 100
                            };
                        });
                        return [2 /*return*/, {
                                periodo: { desde: desde, hasta: hasta },
                                totalFunciones: funciones.length,
                                ocupacionPorFuncion: ocupacionPorFuncion
                            }];
                }
            });
        });
    };
    ReportesService.prototype.reporteTopPeliculas = function (desde, hasta, limit) {
        if (limit === void 0) { limit = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var topPeliculas, peliculasConVentas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.pelicula.findMany({
                            include: {
                                funciones: {
                                    where: {
                                        inicio: {
                                            gte: desde,
                                            lte: hasta
                                        },
                                        cancelada: false
                                    },
                                    include: {
                                        _count: { select: { boletos: true } }
                                    }
                                }
                            }
                        })];
                    case 1:
                        topPeliculas = _a.sent();
                        peliculasConVentas = topPeliculas
                            .map(function (pelicula) {
                            var totalBoletos = pelicula.funciones.reduce(function (sum, funcion) { return sum + funcion._count.boletos; }, 0);
                            var totalFunciones = pelicula.funciones.length;
                            return {
                                id: pelicula.id,
                                titulo: pelicula.titulo,
                                totalBoletos: totalBoletos,
                                totalFunciones: totalFunciones,
                                promedioBoletosPorFuncion: totalFunciones > 0 ? totalBoletos / totalFunciones : 0
                            };
                        })
                            .filter(function (pelicula) { return pelicula.totalBoletos > 0; })
                            .sort(function (a, b) { return b.totalBoletos - a.totalBoletos; })
                            .slice(0, limit);
                        return [2 /*return*/, {
                                periodo: { desde: desde, hasta: hasta },
                                topPeliculas: peliculasConVentas
                            }];
                }
            });
        });
    };
    ReportesService.prototype.reporteVentasPorVendedor = function (desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            var ventasPorVendedor, vendedoresConVentas;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.pedido.groupBy({
                            by: ['vendedorId'],
                            where: {
                                createdAt: {
                                    gte: desde,
                                    lte: hasta
                                },
                                vendedorId: { not: null }
                            },
                            _sum: {
                                total: true
                            },
                            _count: {
                                id: true
                            }
                        })];
                    case 1:
                        ventasPorVendedor = _a.sent();
                        return [4 /*yield*/, Promise.all(ventasPorVendedor.map(function (venta) { return __awaiter(_this, void 0, void 0, function () {
                                var vendedor;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                                where: { id: venta.vendedorId },
                                                select: { nombre: true, email: true }
                                            })];
                                        case 1:
                                            vendedor = _a.sent();
                                            return [2 /*return*/, {
                                                    vendedorId: venta.vendedorId,
                                                    nombre: (vendedor === null || vendedor === void 0 ? void 0 : vendedor.nombre) || 'N/A',
                                                    email: (vendedor === null || vendedor === void 0 ? void 0 : vendedor.email) || 'N/A',
                                                    totalVentas: Number(venta._sum.total),
                                                    cantidadPedidos: venta._count.id
                                                }];
                                    }
                                });
                            }); }))];
                    case 2:
                        vendedoresConVentas = _a.sent();
                        return [2 /*return*/, {
                                periodo: { desde: desde, hasta: hasta },
                                ventasPorVendedor: vendedoresConVentas.sort(function (a, b) { return b.totalVentas - a.totalVentas; })
                            }];
                }
            });
        });
    };
    ReportesService.prototype.reporteDesglosePorTipo = function (vendedorId, desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            var items, boletosCantidad, boletosTotal, dulceriaCantidad, dulceriaTotal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('📊 REPORTES: Generando desglose por tipo para vendedor:', vendedorId);
                        return [4 /*yield*/, this.prisma.pedidoItem.findMany({
                                where: {
                                    pedido: {
                                        vendedorId: vendedorId,
                                        createdAt: {
                                            gte: desde,
                                            lte: hasta
                                        }
                                    }
                                },
                                select: {
                                    tipo: true,
                                    cantidad: true,
                                    precioUnitario: true
                                }
                            })];
                    case 1:
                        items = _a.sent();
                        boletosCantidad = 0;
                        boletosTotal = 0;
                        dulceriaCantidad = 0;
                        dulceriaTotal = 0;
                        items.forEach(function (item) {
                            var subtotal = Number(item.precioUnitario) * item.cantidad;
                            if (item.tipo === 'BOLETO') {
                                boletosCantidad += item.cantidad;
                                boletosTotal += subtotal;
                            }
                            else if (item.tipo === 'DULCERIA') {
                                dulceriaCantidad += item.cantidad;
                                dulceriaTotal += subtotal;
                            }
                        });
                        console.log('📊 REPORTES: Desglose calculado:', {
                            boletos: { cantidad: boletosCantidad, total: boletosTotal },
                            dulceria: { cantidad: dulceriaCantidad, total: dulceriaTotal }
                        });
                        return [2 /*return*/, {
                                periodo: { desde: desde, hasta: hasta },
                                vendedorId: vendedorId,
                                desglose: {
                                    boletos: {
                                        cantidad: boletosCantidad,
                                        total: boletosTotal
                                    },
                                    dulceria: {
                                        cantidad: dulceriaCantidad,
                                        total: dulceriaTotal
                                    }
                                }
                            }];
                }
            });
        });
    };
    ReportesService.prototype.reporteVentasDulceria = function (desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            var itemsDulceria, productoIds, productos, productosMap, ventasPorProductoMap, ventasPorProducto, ventasPorDiaMap, ventasPorDia, totalVentas, totalProductosVendidos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🍿 REPORTES: Generando reporte de ventas de dulcería');
                        console.log('📅 REPORTES: Período:', { desde: desde, hasta: hasta });
                        return [4 /*yield*/, this.prisma.pedidoItem.findMany({
                                where: {
                                    tipo: 'DULCERIA',
                                    pedido: {
                                        createdAt: {
                                            gte: desde,
                                            lte: hasta
                                        }
                                    }
                                },
                                include: {
                                    pedido: {
                                        select: {
                                            createdAt: true,
                                            total: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        itemsDulceria = _a.sent();
                        console.log("\uD83D\uDCCA REPORTES: Encontrados " + itemsDulceria.length + " items de dulcer\u00EDa");
                        productoIds = __spreadArrays(new Set(itemsDulceria.map(function (item) { return item.referenciaId; })));
                        return [4 /*yield*/, this.prisma.dulceriaItem.findMany({
                                where: {
                                    id: { "in": productoIds }
                                }
                            })];
                    case 2:
                        productos = _a.sent();
                        productosMap = new Map(productos.map(function (p) { return [p.id, p]; }));
                        ventasPorProductoMap = new Map();
                        itemsDulceria.forEach(function (item) {
                            var producto = productosMap.get(item.referenciaId);
                            if (!producto)
                                return;
                            var key = item.referenciaId;
                            var existing = ventasPorProductoMap.get(key);
                            var subtotal = Number(item.precioUnitario) * item.cantidad;
                            if (existing) {
                                existing.cantidadVendida += item.cantidad;
                                existing.totalVentas += subtotal;
                            }
                            else {
                                ventasPorProductoMap.set(key, {
                                    productoId: producto.id,
                                    nombre: producto.nombre,
                                    tipo: producto.tipo,
                                    cantidadVendida: item.cantidad,
                                    totalVentas: subtotal
                                });
                            }
                        });
                        ventasPorProducto = Array.from(ventasPorProductoMap.values())
                            .sort(function (a, b) { return b.totalVentas - a.totalVentas; });
                        ventasPorDiaMap = new Map();
                        itemsDulceria.forEach(function (item) {
                            var fecha = item.pedido.createdAt.toISOString().split('T')[0];
                            var existing = ventasPorDiaMap.get(fecha);
                            var subtotal = Number(item.precioUnitario) * item.cantidad;
                            if (existing) {
                                existing.cantidadProductos += item.cantidad;
                                existing.totalVentas += subtotal;
                            }
                            else {
                                ventasPorDiaMap.set(fecha, {
                                    fecha: fecha,
                                    cantidadProductos: item.cantidad,
                                    totalVentas: subtotal
                                });
                            }
                        });
                        ventasPorDia = Array.from(ventasPorDiaMap.values())
                            .sort(function (a, b) { return a.fecha.localeCompare(b.fecha); });
                        totalVentas = ventasPorProducto.reduce(function (sum, p) { return sum + p.totalVentas; }, 0);
                        totalProductosVendidos = ventasPorProducto.reduce(function (sum, p) { return sum + p.cantidadVendida; }, 0);
                        console.log('💰 REPORTES: Total ventas dulcería:', totalVentas);
                        console.log('📦 REPORTES: Total productos vendidos:', totalProductosVendidos);
                        return [2 /*return*/, {
                                periodo: { desde: desde, hasta: hasta },
                                totalVentas: totalVentas,
                                totalProductosVendidos: totalProductosVendidos,
                                ventasPorProducto: ventasPorProducto,
                                ventasPorDia: ventasPorDia
                            }];
                }
            });
        });
    };
    ReportesService = __decorate([
        common_1.Injectable()
    ], ReportesService);
    return ReportesService;
}());
exports.ReportesService = ReportesService;
