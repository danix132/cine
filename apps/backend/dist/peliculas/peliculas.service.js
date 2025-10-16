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
exports.PeliculasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let PeliculasService = class PeliculasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPeliculaDto) {
        const pelicula = await this.prisma.pelicula.create({
            data: createPeliculaDto,
        });
        return pelicula;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search = '', estado, genero } = query;
        const skip = (page - 1) * limit;
        let where = {};
        if (search) {
            where = {
                OR: [
                    { titulo: { contains: search, mode: 'insensitive' } },
                    { sinopsis: { contains: search, mode: 'insensitive' } },
                    { generos: { hasSome: [search] } },
                ],
            };
        }
        if (estado)
            where.estado = estado;
        if (genero)
            where.generos = { hasSome: [genero] };
        const [peliculas, total] = await Promise.all([
            this.prisma.pelicula.findMany({
                where,
                include: {
                    _count: { select: { funciones: true } },
                },
                skip,
                take: limit,
                orderBy: { titulo: 'asc' },
            }),
            this.prisma.pelicula.count({ where }),
        ]);
        return (0, pagination_dto_1.createPaginatedResponse)(peliculas, total, page, limit);
    }
    async findActive() {
        return this.prisma.pelicula.findMany({
            where: { estado: 'ACTIVA' },
            include: {
                funciones: {
                    where: {
                        inicio: { gt: new Date() },
                        cancelada: false,
                    },
                    include: {
                        sala: true,
                    },
                    orderBy: { inicio: 'asc' },
                },
            },
            orderBy: { titulo: 'asc' },
        });
    }
    async findOne(id) {
        const pelicula = await this.prisma.pelicula.findUnique({
            where: { id },
            include: {
                funciones: {
                    where: {
                        cancelada: false,
                    },
                    include: {
                        sala: true,
                    },
                    orderBy: { inicio: 'asc' },
                },
                _count: {
                    select: {
                        funciones: true,
                    },
                },
            },
        });
        if (!pelicula) {
            throw new common_1.NotFoundException('Película no encontrada');
        }
        return pelicula;
    }
    async update(id, updatePeliculaDto) {
        await this.findOne(id);
        const pelicula = await this.prisma.pelicula.update({
            where: { id },
            data: updatePeliculaDto,
        });
        return pelicula;
    }
    async remove(id) {
        const peliculaExistente = await this.findOne(id);
        const totalFunciones = await this.prisma.funcion.count({
            where: { peliculaId: id },
        });
        const funcionesProgramadas = await this.prisma.funcion.count({
            where: {
                peliculaId: id,
                inicio: { gt: new Date() },
                cancelada: false,
            },
        });
        const boletosVendidos = await this.prisma.boleto.count({
            where: {
                funcion: { peliculaId: id },
                estado: { in: ['RESERVADO', 'PAGADO', 'VALIDADO'] }
            }
        });
        console.log(`Eliminando película ${id}:`, {
            peliculaId: id,
            titulo: peliculaExistente.titulo,
            totalFunciones: totalFunciones,
            funcionesProgramadas: funcionesProgramadas,
            boletosVendidos: boletosVendidos,
            estadoActual: peliculaExistente.estado
        });
        if (boletosVendidos > 0 || funcionesProgramadas > 0) {
            let razon = [];
            if (boletosVendidos > 0)
                razon.push(`${boletosVendidos} boleto(s) vendido(s)`);
            if (funcionesProgramadas > 0)
                razon.push(`${funcionesProgramadas} función(es) programada(s)`);
            throw new common_1.BadRequestException(`No se puede eliminar completamente la película "${peliculaExistente.titulo}" porque tiene ${razon.join(' y ')}.`);
        }
        if (totalFunciones === 0) {
            await this.prisma.pelicula.delete({
                where: { id },
            });
            console.log(`🗑️ Película "${peliculaExistente.titulo}" eliminada COMPLETAMENTE de la base de datos`);
            return {
                message: `Película "${peliculaExistente.titulo}" eliminada COMPLETAMENTE de la base de datos`,
                eliminacionCompleta: true
            };
        }
        else {
            await this.prisma.funcion.deleteMany({
                where: { peliculaId: id }
            });
            await this.prisma.pelicula.delete({
                where: { id },
            });
            console.log(`🗑️ Película "${peliculaExistente.titulo}" y sus ${totalFunciones} función(es) pasada(s) eliminadas COMPLETAMENTE`);
            return {
                message: `Película "${peliculaExistente.titulo}" eliminada COMPLETAMENTE junto con ${totalFunciones} función(es) pasada(s)`,
                eliminacionCompleta: true,
                funcionesEliminadas: totalFunciones
            };
        }
    }
    async forceRemove(id) {
        const peliculaExistente = await this.findOne(id);
        console.log(`🚨 ELIMINACIÓN FORZADA - Película ${id}:`, {
            peliculaId: id,
            titulo: peliculaExistente.titulo,
            warning: 'ELIMINACIÓN COMPLETA INCLUYENDO TODOS LOS DATOS RELACIONADOS'
        });
        const resultado = await this.prisma.$transaction(async (prisma) => {
            const boletosRelacionados = await prisma.boleto.findMany({
                where: { funcion: { peliculaId: id } },
                select: { id: true }
            });
            const idsBoletosRelacionados = boletosRelacionados.map(b => b.id);
            const itemsCarritoEliminados = await prisma.carritoItem.deleteMany({
                where: {
                    tipo: 'BOLETO',
                    referenciaId: { in: idsBoletosRelacionados }
                }
            });
            const itemsPedidoEliminados = await prisma.pedidoItem.deleteMany({
                where: {
                    tipo: 'BOLETO',
                    referenciaId: { in: idsBoletosRelacionados }
                }
            });
            await prisma.pelicula.delete({
                where: { id }
            });
            return {
                boletosAfectados: idsBoletosRelacionados.length,
                itemsCarritoEliminados: itemsCarritoEliminados.count,
                itemsPedidoEliminados: itemsPedidoEliminados.count,
            };
        });
        console.log(`🗑️ ELIMINACIÓN FORZADA COMPLETADA - Película "${peliculaExistente.titulo}":`, resultado);
        return {
            message: `🚨 Película "${peliculaExistente.titulo}" ELIMINADA COMPLETAMENTE DE LA BASE DE DATOS`,
            eliminacionForzada: true,
            titulo: peliculaExistente.titulo,
            datosEliminados: resultado
        };
    }
    async findByGenero(genero) {
        return this.prisma.pelicula.findMany({
            where: {
                generos: { has: genero },
                estado: 'ACTIVA',
            },
            include: {
                funciones: {
                    where: {
                        inicio: { gt: new Date() },
                        cancelada: false,
                    },
                    include: {
                        sala: true,
                    },
                },
            },
        });
    }
};
exports.PeliculasService = PeliculasService;
exports.PeliculasService = PeliculasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PeliculasService);
//# sourceMappingURL=peliculas.service.js.map