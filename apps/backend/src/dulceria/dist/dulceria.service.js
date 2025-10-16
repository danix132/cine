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
exports.DulceriaService = void 0;
var common_1 = require("@nestjs/common");
var pagination_dto_1 = require("../common/dto/pagination.dto");
var DulceriaService = /** @class */ (function () {
    function DulceriaService(prisma) {
        this.prisma = prisma;
    }
    DulceriaService.prototype.create = function (createDulceriaItemDto) {
        return __awaiter(this, void 0, void 0, function () {
            var dulceriaItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.dulceriaItem.create({
                            data: createDulceriaItemDto
                        })];
                    case 1:
                        dulceriaItem = _a.sent();
                        return [2 /*return*/, dulceriaItem];
                }
            });
        });
    };
    DulceriaService.prototype.findAll = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, _c, search, tipo, activo, skip, where, _d, items, total;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, _c = query.search, search = _c === void 0 ? '' : _c, tipo = query.tipo, activo = query.activo;
                        skip = (page - 1) * limit;
                        where = {};
                        if (search) {
                            where = {
                                OR: [
                                    { nombre: { contains: search, mode: 'insensitive' } },
                                    { descripcion: { contains: search, mode: 'insensitive' } },
                                ]
                            };
                        }
                        if (tipo)
                            where.tipo = tipo;
                        if (activo !== undefined)
                            where.activo = activo;
                        return [4 /*yield*/, Promise.all([
                                this.prisma.dulceriaItem.findMany({
                                    where: where,
                                    include: {
                                        _count: {
                                            select: {
                                                movimientos: true
                                            }
                                        }
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: { nombre: 'asc' }
                                }),
                                this.prisma.dulceriaItem.count({ where: where }),
                            ])];
                    case 1:
                        _d = _e.sent(), items = _d[0], total = _d[1];
                        return [2 /*return*/, pagination_dto_1.createPaginatedResponse(items, total, page, limit)];
                }
            });
        });
    };
    DulceriaService.prototype.findActive = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.dulceriaItem.findMany({
                        where: { activo: true },
                        orderBy: { nombre: 'asc' }
                    })];
            });
        });
    };
    DulceriaService.prototype.findByTipo = function (tipo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.dulceriaItem.findMany({
                        where: {
                            tipo: tipo,
                            activo: true
                        },
                        orderBy: { nombre: 'asc' }
                    })];
            });
        });
    };
    DulceriaService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var dulceriaItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.dulceriaItem.findUnique({
                            where: { id: id }
                        })];
                    case 1:
                        dulceriaItem = _a.sent();
                        if (!dulceriaItem) {
                            throw new common_1.NotFoundException('Item de dulcería no encontrado');
                        }
                        return [2 /*return*/, dulceriaItem];
                }
            });
        });
    };
    DulceriaService.prototype.update = function (id, updateDulceriaItemDto) {
        return __awaiter(this, void 0, void 0, function () {
            var dulceriaItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar si el item existe
                    return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        // Verificar si el item existe
                        _a.sent();
                        return [4 /*yield*/, this.prisma.dulceriaItem.update({
                                where: { id: id },
                                data: updateDulceriaItemDto
                            })];
                    case 2:
                        dulceriaItem = _a.sent();
                        return [2 /*return*/, dulceriaItem];
                }
            });
        });
    };
    DulceriaService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var dulceriaItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar si el item existe
                    return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        // Verificar si el item existe
                        _a.sent();
                        return [4 /*yield*/, this.prisma.dulceriaItem.update({
                                where: { id: id },
                                data: { activo: false }
                            })];
                    case 2:
                        dulceriaItem = _a.sent();
                        return [2 /*return*/, { message: 'Item de dulcería marcado como inactivo exitosamente', dulceriaItem: dulceriaItem }];
                }
            });
        });
    };
    DulceriaService.prototype.activar = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var dulceriaItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar si el item existe
                    return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        // Verificar si el item existe
                        _a.sent();
                        return [4 /*yield*/, this.prisma.dulceriaItem.update({
                                where: { id: id },
                                data: { activo: true }
                            })];
                    case 2:
                        dulceriaItem = _a.sent();
                        return [2 /*return*/, { message: 'Item de dulcería activado exitosamente', dulceriaItem: dulceriaItem }];
                }
            });
        });
    };
    DulceriaService.prototype.registrarMovimiento = function (dulceriaItemId, delta, motivo) {
        return __awaiter(this, void 0, void 0, function () {
            var movimiento;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar que el item existe
                    return [4 /*yield*/, this.findOne(dulceriaItemId)];
                    case 1:
                        // Verificar que el item existe
                        _a.sent();
                        return [4 /*yield*/, this.prisma.inventarioMov.create({
                                data: {
                                    dulceriaItemId: dulceriaItemId,
                                    delta: delta,
                                    motivo: motivo
                                }
                            })];
                    case 2:
                        movimiento = _a.sent();
                        return [2 /*return*/, movimiento];
                }
            });
        });
    };
    DulceriaService.prototype.obtenerInventario = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, inventario;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.dulceriaItem.findMany({
                            where: { activo: true },
                            include: {
                                _count: {
                                    select: {
                                        movimientos: true
                                    }
                                }
                            }
                        })];
                    case 1:
                        items = _a.sent();
                        return [4 /*yield*/, Promise.all(items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var movimientos, stock;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.prisma.inventarioMov.findMany({
                                                where: { dulceriaItemId: item.id }
                                            })];
                                        case 1:
                                            movimientos = _a.sent();
                                            stock = movimientos.reduce(function (sum, mov) { return sum + mov.delta; }, 0);
                                            return [2 /*return*/, __assign(__assign({}, item), { stock: stock })];
                                    }
                                });
                            }); }))];
                    case 2:
                        inventario = _a.sent();
                        return [2 /*return*/, inventario];
                }
            });
        });
    };
    DulceriaService.prototype.procesarVenta = function (ventaDto, vendedorId) {
        return __awaiter(this, void 0, void 0, function () {
            var productosIds, productos, productosMap, total, itemsConPrecio, pedido, pedidoItems, pedidoCompleto, pedidoConProductos;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🍿 SERVICE: Procesando venta de dulcería');
                        console.log('📦 Items:', ventaDto.items);
                        console.log('👤 Vendedor ID:', vendedorId);
                        // Validar que haya items
                        if (!ventaDto.items || ventaDto.items.length === 0) {
                            throw new common_1.BadRequestException('Debe incluir al menos un item para la venta');
                        }
                        productosIds = ventaDto.items.map(function (item) { return item.dulceriaItemId; });
                        return [4 /*yield*/, this.prisma.dulceriaItem.findMany({
                                where: {
                                    id: { "in": productosIds },
                                    activo: true
                                }
                            })];
                    case 1:
                        productos = _a.sent();
                        // Validar que todos los productos existan
                        if (productos.length !== productosIds.length) {
                            throw new common_1.BadRequestException('Uno o más productos no están disponibles');
                        }
                        productosMap = new Map(productos.map(function (p) { return [p.id, p]; }));
                        total = 0;
                        itemsConPrecio = ventaDto.items.map(function (item) {
                            var producto = productosMap.get(item.dulceriaItemId);
                            if (!producto) {
                                throw new common_1.BadRequestException("Producto " + item.dulceriaItemId + " no encontrado");
                            }
                            var subtotal = Number(producto.precio) * item.cantidad;
                            total += subtotal;
                            return __assign(__assign({}, item), { precio: Number(producto.precio), subtotal: subtotal });
                        });
                        console.log('💰 Total de la venta:', total);
                        return [4 /*yield*/, this.prisma.pedido.create({
                                data: {
                                    usuarioId: vendedorId,
                                    vendedorId: vendedorId,
                                    total: total,
                                    tipo: 'MOSTRADOR'
                                }
                            })];
                    case 2:
                        pedido = _a.sent();
                        console.log('✅ Pedido creado:', pedido.id);
                        return [4 /*yield*/, Promise.all(itemsConPrecio.map(function (item) {
                                var producto = productosMap.get(item.dulceriaItemId);
                                return _this.prisma.pedidoItem.create({
                                    data: {
                                        pedido: {
                                            connect: { id: pedido.id }
                                        },
                                        tipo: 'DULCERIA',
                                        referenciaId: item.dulceriaItemId,
                                        descripcion: (producto === null || producto === void 0 ? void 0 : producto.nombre) || 'Producto de dulcería',
                                        cantidad: item.cantidad,
                                        precio: item.precio,
                                        precioUnitario: item.precio,
                                        subtotal: item.subtotal
                                    }
                                });
                            }))];
                    case 3:
                        pedidoItems = _a.sent();
                        console.log("\u2705 Creados " + pedidoItems.length + " items del pedido");
                        // Registrar movimientos de inventario (salida)
                        return [4 /*yield*/, Promise.all(itemsConPrecio.map(function (item) {
                                return _this.registrarMovimiento(item.dulceriaItemId, -item.cantidad, // Negativo porque es una salida
                                "Venta - Pedido " + pedido.id);
                            }))];
                    case 4:
                        // Registrar movimientos de inventario (salida)
                        _a.sent();
                        console.log('✅ Movimientos de inventario registrados');
                        return [4 /*yield*/, this.prisma.pedido.findUnique({
                                where: { id: pedido.id },
                                include: {
                                    items: true,
                                    vendedor: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                    case 5:
                        pedidoCompleto = _a.sent();
                        pedidoConProductos = __assign(__assign({}, pedidoCompleto), { items: pedidoCompleto.items.map(function (item) {
                                var producto = productosMap.get(item.referenciaId);
                                return __assign(__assign({}, item), { producto: producto ? {
                                        id: producto.id,
                                        nombre: producto.nombre,
                                        tipo: producto.tipo
                                    } : null });
                            }) });
                        console.log('🎉 Venta procesada exitosamente');
                        return [2 /*return*/, {
                                success: true,
                                pedido: pedidoConProductos,
                                message: 'Venta de dulcería procesada exitosamente'
                            }];
                }
            });
        });
    };
    DulceriaService = __decorate([
        common_1.Injectable()
    ], DulceriaService);
    return DulceriaService;
}());
exports.DulceriaService = DulceriaService;
