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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.PedidosService = void 0;
var common_1 = require("@nestjs/common");
var PedidosService = /** @class */ (function () {
    function PedidosService(prisma) {
        this.prisma = prisma;
    }
    PedidosService.prototype.create = function (createPedidoDto) {
        return __awaiter(this, void 0, void 0, function () {
            var items, pedidoData;
            return __generator(this, function (_a) {
                items = createPedidoDto.items, pedidoData = __rest(createPedidoDto, ["items"]);
                return [2 /*return*/, this.prisma.pedido.create({
                        data: {
                            usuarioId: pedidoData.usuarioId,
                            vendedorId: pedidoData.vendedorId,
                            total: pedidoData.total,
                            tipo: pedidoData.tipo,
                            items: {
                                create: items.map(function (item) { return ({
                                    tipo: item.tipo,
                                    referenciaId: item.referenciaId,
                                    descripcion: item.descripcion || '',
                                    cantidad: item.cantidad,
                                    precio: item.precioUnitario,
                                    precioUnitario: item.precioUnitario,
                                    subtotal: (item.cantidad * item.precioUnitario)
                                }); })
                            }
                        },
                        include: {
                            usuario: { select: { nombre: true, email: true } },
                            vendedor: { select: { nombre: true, email: true } },
                            items: {
                                include: {
                                    pedido: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    PedidosService.prototype.findAll = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, usuarioId, vendedorId, tipo, desde, hasta, skip, where, _c, pedidos, total;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, usuarioId = query.usuarioId, vendedorId = query.vendedorId, tipo = query.tipo, desde = query.desde, hasta = query.hasta;
                        skip = (page - 1) * limit;
                        where = {};
                        if (usuarioId)
                            where.usuarioId = usuarioId;
                        if (vendedorId)
                            where.vendedorId = vendedorId;
                        if (tipo)
                            where.tipo = tipo;
                        if (desde)
                            where.createdAt = { gte: new Date(desde) };
                        if (hasta)
                            where.createdAt = __assign(__assign({}, where.createdAt), { lte: new Date(hasta) });
                        return [4 /*yield*/, Promise.all([
                                this.prisma.pedido.findMany({
                                    where: where,
                                    include: {
                                        usuario: { select: { nombre: true, email: true } },
                                        vendedor: { select: { nombre: true, email: true } },
                                        items: {
                                            include: {
                                                pedido: true
                                            }
                                        }
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: { createdAt: 'desc' }
                                }),
                                this.prisma.pedido.count({ where: where }),
                            ])];
                    case 1:
                        _c = _d.sent(), pedidos = _c[0], total = _c[1];
                        return [2 /*return*/, { pedidos: pedidos, total: total, page: page, limit: limit }];
                }
            });
        });
    };
    PedidosService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var pedido;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.pedido.findUnique({
                            where: { id: id },
                            include: {
                                usuario: { select: { nombre: true, email: true } },
                                vendedor: { select: { nombre: true, email: true } },
                                items: {
                                    include: {
                                        pedido: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        pedido = _a.sent();
                        if (!pedido) {
                            throw new common_1.NotFoundException('Pedido no encontrado');
                        }
                        return [2 /*return*/, pedido];
                }
            });
        });
    };
    PedidosService.prototype.update = function (id, updatePedidoDto) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        _a.sent();
                        updateData = {};
                        if (updatePedidoDto.usuarioId !== undefined)
                            updateData.usuarioId = updatePedidoDto.usuarioId;
                        if (updatePedidoDto.vendedorId !== undefined)
                            updateData.vendedorId = updatePedidoDto.vendedorId;
                        if (updatePedidoDto.total !== undefined)
                            updateData.total = updatePedidoDto.total;
                        if (updatePedidoDto.tipo !== undefined)
                            updateData.tipo = updatePedidoDto.tipo;
                        return [2 /*return*/, this.prisma.pedido.update({
                                where: { id: id },
                                data: updateData,
                                include: {
                                    usuario: { select: { nombre: true, email: true } },
                                    vendedor: { select: { nombre: true, email: true } },
                                    items: {
                                        include: {
                                            pedido: true
                                        }
                                    }
                                }
                            })];
                }
            });
        });
    };
    PedidosService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.prisma.pedido["delete"]({
                                where: { id: id }
                            })];
                }
            });
        });
    };
    PedidosService.prototype.findMyOrders = function (usuarioId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.pedido.findMany({
                        where: { usuarioId: usuarioId },
                        include: {
                            items: {
                                include: {
                                    pedido: true
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    })];
            });
        });
    };
    PedidosService = __decorate([
        common_1.Injectable()
    ], PedidosService);
    return PedidosService;
}());
exports.PedidosService = PedidosService;
