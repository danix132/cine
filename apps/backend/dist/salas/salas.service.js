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
exports.SalasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let SalasService = class SalasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSalaDto) {
        const { nombre, filas, asientosPorFila } = createSalaDto;
        const sala = await this.prisma.sala.create({
            data: {
                nombre,
                filas,
                asientosPorFila,
            },
        });
        const asientos = [];
        for (let fila = 1; fila <= filas; fila++) {
            for (let numero = 1; numero <= asientosPorFila; numero++) {
                asientos.push({
                    salaId: sala.id,
                    fila,
                    numero,
                    estado: 'DISPONIBLE',
                });
            }
        }
        await this.prisma.asiento.createMany({
            data: asientos,
        });
        return sala;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const skip = (page - 1) * limit;
        let where = {};
        if (search) {
            where = {
                nombre: { contains: search, mode: 'insensitive' },
            };
        }
        const [salas, total] = await Promise.all([
            this.prisma.sala.findMany({
                where,
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
                skip,
                take: limit,
                orderBy: { nombre: 'asc' },
            }),
            this.prisma.sala.count({ where }),
        ]);
        return (0, pagination_dto_1.createPaginatedResponse)(salas, total, page, limit);
    }
    async findOne(id) {
        const sala = await this.prisma.sala.findUnique({
            where: { id },
            include: {
                asientos: {
                    orderBy: [
                        { fila: 'asc' },
                        { numero: 'asc' },
                    ],
                },
                _count: {
                    select: {
                        asientos: true,
                        funciones: true,
                    },
                },
            },
        });
        if (!sala) {
            throw new common_1.NotFoundException('Sala no encontrada');
        }
        return sala;
    }
    async update(id, updateSalaDto) {
        console.log('🏢 SalasService.update - Recibido:', { id, updateSalaDto });
        console.log('🏢 Tipos de datos recibidos:', {
            nombre: typeof updateSalaDto.nombre,
            filas: typeof updateSalaDto.filas,
            asientosPorFila: typeof updateSalaDto.asientosPorFila,
            filasValue: updateSalaDto.filas,
            asientosPorFilaValue: updateSalaDto.asientosPorFila
        });
        const updateData = {};
        if (updateSalaDto.nombre !== undefined)
            updateData.nombre = updateSalaDto.nombre;
        if (updateSalaDto.filas !== undefined)
            updateData.filas = updateSalaDto.filas;
        if (updateSalaDto.asientosPorFila !== undefined)
            updateData.asientosPorFila = updateSalaDto.asientosPorFila;
        console.log('🏢 Datos preparados para actualizar:', updateData);
        const salaExistente = await this.findOne(id);
        console.log('🏢 Sala existente encontrada:', salaExistente);
        if (updateSalaDto.filas !== undefined || updateSalaDto.asientosPorFila !== undefined) {
            const nuevasFilas = updateSalaDto.filas ?? salaExistente.filas;
            const nuevosAsientosPorFila = updateSalaDto.asientosPorFila ?? salaExistente.asientosPorFila;
            console.log('🏢 Actualizando dimensiones:', { nuevasFilas, nuevosAsientosPorFila });
            const funcionesProgramadas = await this.prisma.funcion.findFirst({
                where: {
                    salaId: id,
                    inicio: { gt: new Date() },
                },
            });
            if (funcionesProgramadas) {
                throw new common_1.BadRequestException('No se puede modificar una sala con funciones programadas');
            }
            await this.prisma.asiento.deleteMany({
                where: { salaId: id },
            });
            const asientos = [];
            for (let fila = 1; fila <= nuevasFilas; fila++) {
                for (let numero = 1; numero <= nuevosAsientosPorFila; numero++) {
                    asientos.push({
                        salaId: id,
                        fila,
                        numero,
                        estado: 'DISPONIBLE',
                    });
                }
            }
            await this.prisma.asiento.createMany({
                data: asientos,
            });
            updateData.filas = nuevasFilas;
            updateData.asientosPorFila = nuevosAsientosPorFila;
        }
        else {
            console.log('🏢 No se regeneran asientos, solo se actualizan campos');
        }
        console.log('🏢 Datos a actualizar:', updateData);
        const sala = await this.prisma.sala.update({
            where: { id },
            data: updateData,
        });
        console.log('🏢 Sala actualizada:', sala);
        return sala;
    }
    async remove(id) {
        await this.findOne(id);
        const funcionesProgramadas = await this.prisma.funcion.findFirst({
            where: {
                salaId: id,
                inicio: { gt: new Date() },
            },
        });
        if (funcionesProgramadas) {
            throw new common_1.BadRequestException('No se puede eliminar una sala con funciones programadas');
        }
        await this.prisma.sala.delete({
            where: { id },
        });
        return { message: 'Sala eliminada exitosamente' };
    }
    async updateAsientosDanados(id, updateAsientosDanadosDto) {
        const { asientosDanados } = updateAsientosDanadosDto;
        console.log('🔧 Actualizando asientos dañados para sala:', id);
        console.log('🔧 Asientos a marcar como dañados:', asientosDanados);
        const sala = await this.findOne(id);
        console.log('🔧 Paso 1: Restaurando todos los asientos a DISPONIBLE');
        await this.prisma.asiento.updateMany({
            where: {
                salaId: id,
            },
            data: {
                estado: 'DISPONIBLE',
            },
        });
        if (asientosDanados && asientosDanados.length > 0) {
            console.log('🔧 Paso 2: Marcando asientos específicos como DAÑADOS');
            for (const asiento of asientosDanados) {
                console.log(`🔧 Marcando como dañado: Fila ${asiento.fila}, Asiento ${asiento.numero}`);
                const resultado = await this.prisma.asiento.updateMany({
                    where: {
                        salaId: id,
                        fila: asiento.fila,
                        numero: asiento.numero,
                    },
                    data: {
                        estado: 'DANADO',
                    },
                });
                console.log(`🔧 Resultado actualización: ${resultado.count} asiento(s) actualizados`);
            }
        }
        const asientosFinales = await this.prisma.asiento.findMany({
            where: { salaId: id },
            select: { fila: true, numero: true, estado: true }
        });
        const asientosDanadosFinales = asientosFinales.filter(a => a.estado === 'DANADO');
        console.log('🔧 Estado final - Total asientos dañados:', asientosDanadosFinales.length);
        console.log('🔧 Asientos dañados finales:', asientosDanadosFinales);
        return {
            message: 'Asientos dañados actualizados exitosamente',
            asientosDanadosCount: asientosDanadosFinales.length,
            asientosDanados: asientosDanadosFinales
        };
    }
    async getAsientosDisponibilidad(salaId, funcionId) {
        const sala = await this.findOne(salaId);
        const asientosOcupados = await this.prisma.boleto.findMany({
            where: {
                funcionId,
                estado: { in: ['RESERVADO', 'PAGADO', 'VALIDADO'] },
            },
            select: {
                asientoId: true,
            },
        });
        const asientosOcupadosIds = asientosOcupados.map(b => b.asientoId);
        const asientosConEstado = sala.asientos.map(asiento => ({
            ...asiento,
            disponible: !asientosOcupadosIds.includes(asiento.id) && asiento.estado === 'DISPONIBLE',
        }));
        return asientosConEstado;
    }
};
exports.SalasService = SalasService;
exports.SalasService = SalasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalasService);
//# sourceMappingURL=salas.service.js.map