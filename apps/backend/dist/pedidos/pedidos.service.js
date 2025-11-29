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
exports.PedidosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let PedidosService = class PedidosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPedidoDto) {
        const { items, ...pedidoData } = createPedidoDto;
        return this.prisma.pedido.create({
            data: {
                usuarioId: pedidoData.usuarioId,
                vendedorId: pedidoData.vendedorId,
                total: pedidoData.total,
                tipo: pedidoData.tipo,
                items: {
                    create: items.map(item => ({
                        tipo: item.tipo,
                        referenciaId: item.referenciaId,
                        descripcion: item.descripcion || '',
                        cantidad: item.cantidad,
                        precio: item.precioUnitario,
                        precioUnitario: item.precioUnitario,
                        subtotal: (item.cantidad * item.precioUnitario),
                    })),
                },
            },
            include: {
                usuario: { select: { nombre: true, email: true } },
                vendedor: { select: { nombre: true, email: true } },
                items: {
                    include: {
                        pedido: true,
                    },
                },
            },
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, usuarioId, vendedorId, tipo, desde, hasta } = query;
        const skip = (page - 1) * limit;
        let where = {};
        if (usuarioId)
            where.usuarioId = usuarioId;
        if (vendedorId)
            where.vendedorId = vendedorId;
        if (tipo)
            where.tipo = tipo;
        if (desde)
            where.createdAt = { gte: new Date(desde) };
        if (hasta)
            where.createdAt = { ...where.createdAt, lte: new Date(hasta) };
        const [pedidos, total] = await Promise.all([
            this.prisma.pedido.findMany({
                where,
                include: {
                    usuario: { select: { nombre: true, email: true } },
                    vendedor: { select: { nombre: true, email: true } },
                    items: {
                        include: {
                            pedido: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.pedido.count({ where }),
        ]);
        return { pedidos, total, page, limit };
    }
    async findOne(id) {
        const pedido = await this.prisma.pedido.findUnique({
            where: { id },
            include: {
                usuario: { select: { nombre: true, email: true } },
                vendedor: { select: { nombre: true, email: true } },
                items: true,
            },
        });
        if (!pedido) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        const itemsEnriquecidos = await Promise.all(pedido.items.map(async (item) => {
            if (item.tipo === 'DULCERIA') {
                const dulceriaItem = await this.prisma.dulceriaItem.findUnique({
                    where: { id: item.referenciaId },
                    select: { nombre: true, tipo: true, precio: true },
                });
                return {
                    ...item,
                    dulceriaItem,
                };
            }
            return item;
        }));
        return {
            ...pedido,
            items: itemsEnriquecidos,
        };
    }
    async update(id, updatePedidoDto) {
        await this.findOne(id);
        const updateData = {};
        if (updatePedidoDto.usuarioId !== undefined)
            updateData.usuarioId = updatePedidoDto.usuarioId;
        if (updatePedidoDto.vendedorId !== undefined)
            updateData.vendedorId = updatePedidoDto.vendedorId;
        if (updatePedidoDto.total !== undefined)
            updateData.total = updatePedidoDto.total;
        if (updatePedidoDto.tipo !== undefined)
            updateData.tipo = updatePedidoDto.tipo;
        if (updatePedidoDto.ticketData !== undefined)
            updateData.ticketData = updatePedidoDto.ticketData;
        if (updatePedidoDto.estado !== undefined)
            updateData.estado = updatePedidoDto.estado;
        if (updatePedidoDto.entregado !== undefined)
            updateData.entregado = updatePedidoDto.entregado;
        if (updatePedidoDto.fechaEntrega !== undefined)
            updateData.fechaEntrega = updatePedidoDto.fechaEntrega;
        console.log('🔧 SERVICE: Actualizando pedido', id);
        console.log('   Datos a actualizar:', {
            tieneTicketData: !!updateData.ticketData,
            tamanioTicketData: updateData.ticketData?.length || 0,
            camposActualizados: Object.keys(updateData)
        });
        const resultado = await this.prisma.pedido.update({
            where: { id },
            data: updateData,
            include: {
                usuario: { select: { nombre: true, email: true } },
                vendedor: { select: { nombre: true, email: true } },
                items: {
                    include: {
                        pedido: true,
                    },
                },
            },
        });
        console.log('✅ SERVICE: Pedido actualizado');
        return resultado;
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.pedido.delete({
            where: { id },
        });
    }
    async marcarComoEntregado(id, vendedorId) {
        const pedido = await this.findOne(id);
        const tieneDulceria = pedido.items.some(item => item.tipo === 'DULCERIA');
        if (!tieneDulceria) {
            throw new common_1.NotFoundException('Este pedido no contiene items de dulcería');
        }
        if (pedido.tipo !== 'WEB') {
            throw new common_1.NotFoundException('Solo se pueden entregar pedidos de tipo WEB');
        }
        if (pedido.entregado) {
            throw new common_1.NotFoundException('Este pedido ya fue entregado anteriormente');
        }
        if (pedido.estado !== 'COMPLETADO') {
            throw new common_1.NotFoundException('El pedido debe estar pagado para ser entregado');
        }
        return this.prisma.pedido.update({
            where: { id },
            data: {
                entregado: true,
                fechaEntrega: new Date(),
                entregadoPorId: vendedorId,
            },
            include: {
                usuario: { select: { nombre: true, email: true } },
                vendedor: { select: { nombre: true, email: true } },
                items: true,
            },
        });
    }
    async findMyOrders(usuarioId) {
        console.log('📖 SERVICE: Buscando pedidos del usuario:', usuarioId);
        const resultado = await this.prisma.pedido.findMany({
            where: { usuarioId },
            include: {
                usuario: { select: { nombre: true, email: true } },
                vendedor: { select: { nombre: true, email: true } },
                items: {
                    include: {
                        pedido: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        console.log('✅ SERVICE: Pedidos encontrados:', resultado.length);
        if (resultado.length > 0) {
            const primerPedido = resultado[0];
            console.log('   Primer pedido tiene ticketData:', !!primerPedido?.ticketData);
            console.log('   Tamaño ticketData:', primerPedido?.ticketData?.length || 0);
        }
        return resultado;
    }
};
exports.PedidosService = PedidosService;
exports.PedidosService = PedidosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PedidosService);
//# sourceMappingURL=pedidos.service.js.map