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
exports.DulceriaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let DulceriaService = class DulceriaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDulceriaItemDto) {
        const dulceriaItem = await this.prisma.dulceriaItem.create({
            data: createDulceriaItemDto,
        });
        return dulceriaItem;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search = '', tipo, activo } = query;
        const skip = (page - 1) * limit;
        let where = {};
        if (search) {
            where = {
                OR: [
                    { nombre: { contains: search, mode: 'insensitive' } },
                    { descripcion: { contains: search, mode: 'insensitive' } },
                ],
            };
        }
        if (tipo)
            where.tipo = tipo;
        if (activo !== undefined)
            where.activo = activo;
        const [items, total] = await Promise.all([
            this.prisma.dulceriaItem.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            movimientos: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { nombre: 'asc' },
            }),
            this.prisma.dulceriaItem.count({ where }),
        ]);
        return (0, pagination_dto_1.createPaginatedResponse)(items, total, page, limit);
    }
    async findActive() {
        return this.prisma.dulceriaItem.findMany({
            where: { activo: true },
            orderBy: { nombre: 'asc' },
        });
    }
    async findByTipo(tipo) {
        return this.prisma.dulceriaItem.findMany({
            where: {
                tipo: tipo,
                activo: true,
            },
            orderBy: { nombre: 'asc' },
        });
    }
    async findOne(id) {
        const dulceriaItem = await this.prisma.dulceriaItem.findUnique({
            where: { id },
        });
        if (!dulceriaItem) {
            throw new common_1.NotFoundException('Item de dulcería no encontrado');
        }
        return dulceriaItem;
    }
    async update(id, updateDulceriaItemDto) {
        await this.findOne(id);
        const dulceriaItem = await this.prisma.dulceriaItem.update({
            where: { id },
            data: updateDulceriaItemDto,
        });
        return dulceriaItem;
    }
    async remove(id) {
        await this.findOne(id);
        const dulceriaItem = await this.prisma.dulceriaItem.update({
            where: { id },
            data: { activo: false },
        });
        return { message: 'Item de dulcería marcado como inactivo exitosamente', dulceriaItem };
    }
    async activar(id) {
        await this.findOne(id);
        const dulceriaItem = await this.prisma.dulceriaItem.update({
            where: { id },
            data: { activo: true },
        });
        return { message: 'Item de dulcería activado exitosamente', dulceriaItem };
    }
    async registrarMovimiento(dulceriaItemId, delta, motivo) {
        await this.findOne(dulceriaItemId);
        const movimiento = await this.prisma.inventarioMov.create({
            data: {
                dulceriaItemId,
                delta,
                motivo,
            },
        });
        return movimiento;
    }
    async obtenerInventario() {
        const items = await this.prisma.dulceriaItem.findMany({
            where: { activo: true },
            include: {
                _count: {
                    select: {
                        movimientos: true,
                    },
                },
            },
        });
        const inventario = await Promise.all(items.map(async (item) => {
            const movimientos = await this.prisma.inventarioMov.findMany({
                where: { dulceriaItemId: item.id },
            });
            const stock = movimientos.reduce((sum, mov) => sum + mov.delta, 0);
            return {
                ...item,
                stock,
            };
        }));
        return inventario;
    }
    async procesarVenta(ventaDto, vendedorId) {
        console.log('🍿 SERVICE: Procesando venta de dulcería');
        console.log('📦 Items:', ventaDto.items);
        console.log('👤 Vendedor ID:', vendedorId);
        if (!ventaDto.items || ventaDto.items.length === 0) {
            throw new common_1.BadRequestException('Debe incluir al menos un item para la venta');
        }
        const productosIds = ventaDto.items.map((item) => item.dulceriaItemId);
        const productos = await this.prisma.dulceriaItem.findMany({
            where: {
                id: { in: productosIds },
                activo: true,
            },
        });
        if (productos.length !== productosIds.length) {
            throw new common_1.BadRequestException('Uno o más productos no están disponibles');
        }
        const productosMap = new Map(productos.map(p => [p.id, p]));
        let total = 0;
        const itemsConPrecio = ventaDto.items.map((item) => {
            const producto = productosMap.get(item.dulceriaItemId);
            if (!producto) {
                throw new common_1.BadRequestException(`Producto ${item.dulceriaItemId} no encontrado`);
            }
            const subtotal = Number(producto.precio) * item.cantidad;
            total += subtotal;
            return {
                ...item,
                precio: Number(producto.precio),
                subtotal,
            };
        });
        console.log('💰 Total de la venta:', total);
        const usuario = await this.prisma.user.findUnique({
            where: { id: vendedorId },
            select: { rol: true, nombre: true, email: true }
        });
        console.log('👤 Usuario que realiza la compra:', {
            id: vendedorId,
            nombre: usuario?.nombre,
            email: usuario?.email,
            rol: usuario?.rol
        });
        const tipoPedido = usuario?.rol === 'VENDEDOR' ? 'MOSTRADOR' : 'WEB';
        console.log('🏷️ Tipo de pedido determinado:', tipoPedido);
        const pedido = await this.prisma.pedido.create({
            data: {
                usuarioId: vendedorId,
                vendedorId: tipoPedido === 'MOSTRADOR' ? vendedorId : null,
                total: total,
                tipo: tipoPedido,
                estado: 'COMPLETADO',
                metodoPago: tipoPedido === 'WEB' ? 'TARJETA' : 'EFECTIVO',
            },
        });
        console.log(`✅ Pedido ${tipoPedido} creado:`, pedido.id);
        const pedidoItems = await Promise.all(itemsConPrecio.map((item) => {
            const producto = productosMap.get(item.dulceriaItemId);
            return this.prisma.pedidoItem.create({
                data: {
                    pedido: {
                        connect: { id: pedido.id }
                    },
                    tipo: 'DULCERIA',
                    referenciaId: item.dulceriaItemId,
                    descripcion: producto?.nombre || 'Producto de dulcería',
                    cantidad: item.cantidad,
                    precio: item.precio,
                    precioUnitario: item.precio,
                    subtotal: item.subtotal,
                },
            });
        }));
        console.log(`✅ Creados ${pedidoItems.length} items del pedido`);
        await Promise.all(itemsConPrecio.map((item) => this.registrarMovimiento(item.dulceriaItemId, -item.cantidad, `Venta - Pedido ${pedido.id}`)));
        console.log('✅ Movimientos de inventario registrados');
        const pedidoCompleto = await this.prisma.pedido.findUnique({
            where: { id: pedido.id },
            include: {
                items: true,
                vendedor: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
            },
        });
        const pedidoConProductos = {
            ...pedidoCompleto,
            items: pedidoCompleto.items.map(item => {
                const producto = productosMap.get(item.referenciaId);
                return {
                    ...item,
                    producto: producto ? {
                        id: producto.id,
                        nombre: producto.nombre,
                        tipo: producto.tipo,
                    } : null,
                };
            }),
        };
        console.log('🎉 Venta procesada exitosamente');
        return {
            success: true,
            pedido: pedidoConProductos,
            message: 'Venta de dulcería procesada exitosamente',
        };
    }
};
exports.DulceriaService = DulceriaService;
exports.DulceriaService = DulceriaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DulceriaService);
//# sourceMappingURL=dulceria.service.js.map