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
exports.CarritosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const moment = require("moment-timezone");
let CarritosService = class CarritosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCarritoDto, userId, vendedorId) {
        const { tipo } = createCarritoDto;
        let expiracion;
        if (tipo === 'CLIENTE') {
            expiracion = moment.tz('America/Mazatlan').add(10, 'minutes').toDate();
        }
        else {
            expiracion = moment.tz('America/Mazatlan').add(30, 'minutes').toDate();
        }
        const carrito = await this.prisma.carrito.create({
            data: {
                usuarioId: userId,
                vendedorId,
                tipo,
                expiracion,
            },
            include: {
                items: true,
                usuario: true,
                vendedor: true,
            },
        });
        return carrito;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search = '', tipo, usuarioId, vendedorId } = query;
        const skip = (page - 1) * limit;
        let where = {};
        if (search) {
            where = {
                OR: [
                    { usuario: { nombre: { contains: search, mode: 'insensitive' } } },
                    { vendedor: { nombre: { contains: search, mode: 'insensitive' } } },
                ],
            };
        }
        if (tipo)
            where.tipo = tipo;
        if (usuarioId)
            where.usuarioId = usuarioId;
        if (vendedorId)
            where.vendedorId = vendedorId;
        const [carritos, total] = await Promise.all([
            this.prisma.carrito.findMany({
                where,
                include: {
                    usuario: { select: { id: true, nombre: true, email: true } },
                    vendedor: { select: { id: true, nombre: true, email: true } },
                    items: {
                        include: {
                            carrito: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.carrito.count({ where }),
        ]);
        return (0, pagination_dto_1.createPaginatedResponse)(carritos, total, page, limit);
    }
    async findOne(id, userId, vendedorId) {
        const carrito = await this.prisma.carrito.findUnique({
            where: { id },
            include: {
                items: true,
                usuario: true,
                vendedor: true,
            },
        });
        if (!carrito) {
            throw new common_1.NotFoundException('Carrito no encontrado');
        }
        if (carrito.usuarioId && carrito.usuarioId !== userId) {
            throw new common_1.ForbiddenException('No tienes acceso a este carrito');
        }
        if (carrito.vendedorId && carrito.vendedorId !== vendedorId) {
            throw new common_1.ForbiddenException('No tienes acceso a este carrito');
        }
        if (new Date() > carrito.expiracion) {
            throw new common_1.BadRequestException('El carrito ha expirado');
        }
        return carrito;
    }
    async addItem(id, addItemDto, userId, vendedorId) {
        const carrito = await this.findOne(id, userId, vendedorId);
        const { tipo, referenciaId, cantidad, precioUnitario } = addItemDto;
        if (tipo === 'BOLETO') {
            const boletoExistente = await this.prisma.boleto.findFirst({
                where: {
                    id: referenciaId,
                    estado: { in: ['RESERVADO', 'PAGADO', 'VALIDADO'] },
                },
            });
            if (boletoExistente) {
                throw new common_1.BadRequestException('El asiento ya no está disponible');
            }
            const funcion = await this.prisma.funcion.findUnique({
                where: { id: boletoExistente?.funcionId || '' },
            });
            if (funcion?.cancelada) {
                throw new common_1.BadRequestException('La función está cancelada');
            }
        }
        if (tipo === 'DULCERIA') {
            const dulceriaItem = await this.prisma.dulceriaItem.findUnique({
                where: { id: referenciaId },
            });
            if (!dulceriaItem || !dulceriaItem.activo) {
                throw new common_1.BadRequestException('El item de dulcería no está disponible');
            }
        }
        const item = await this.prisma.carritoItem.create({
            data: {
                carritoId: id,
                tipo,
                referenciaId,
                cantidad,
                precioUnitario,
            },
        });
        const nuevaExpiracion = moment.tz('America/Mazatlan').add(carrito.tipo === 'CLIENTE' ? 10 : 30, 'minutes').toDate();
        await this.prisma.carrito.update({
            where: { id },
            data: { expiracion: nuevaExpiracion },
        });
        return item;
    }
    async updateItem(id, itemId, updateItemDto, userId, vendedorId) {
        await this.findOne(id, userId, vendedorId);
        const item = await this.prisma.carritoItem.update({
            where: { id: itemId },
            data: updateItemDto,
        });
        return item;
    }
    async removeItem(id, itemId, userId, vendedorId) {
        await this.findOne(id, userId, vendedorId);
        await this.prisma.carritoItem.delete({
            where: { id: itemId },
        });
        return { message: 'Item eliminado del carrito' };
    }
    async remove(id, userId, vendedorId) {
        await this.findOne(id, userId, vendedorId);
        await this.prisma.carrito.delete({
            where: { id },
        });
        return { message: 'Carrito eliminado exitosamente' };
    }
    async getCarritoByUser(userId) {
        return this.prisma.carrito.findFirst({
            where: {
                usuarioId: userId,
                expiracion: { gt: new Date() },
            },
            include: {
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getCarritoByVendedor(vendedorId) {
        return this.prisma.carrito.findFirst({
            where: {
                vendedorId,
                expiracion: { gt: new Date() },
            },
            include: {
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async limpiarCarritosExpirados() {
        const carritosExpirados = await this.prisma.carrito.findMany({
            where: {
                expiracion: { lt: new Date() },
            },
        });
        for (const carrito of carritosExpirados) {
            await this.prisma.carrito.delete({
                where: { id: carrito.id },
            });
        }
        return { message: `${carritosExpirados.length} carritos expirados eliminados` };
    }
    calcularTotal(carrito) {
        return carrito.items.reduce((sum, item) => {
            return sum + (Number(item.precioUnitario) * item.cantidad);
        }, 0);
    }
};
exports.CarritosService = CarritosService;
exports.CarritosService = CarritosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CarritosService);
//# sourceMappingURL=carritos.service.js.map