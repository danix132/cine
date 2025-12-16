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
exports.FuncionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const moment = require("moment-timezone");
let FuncionesService = class FuncionesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFuncionDto) {
        const { peliculaId, salaId, inicio, precio, forzarCreacion = false } = createFuncionDto;
        const pelicula = await this.prisma.pelicula.findUnique({
            where: { id: peliculaId },
        });
        if (!pelicula) {
            throw new common_1.NotFoundException('Película no encontrada');
        }
        if (pelicula.estado !== 'ACTIVA') {
            throw new common_1.BadRequestException('Solo se pueden crear funciones para películas activas');
        }
        const sala = await this.prisma.sala.findUnique({
            where: { id: salaId },
            include: {
                asientos: true,
            },
        });
        if (!sala) {
            throw new common_1.NotFoundException('Sala no encontrada');
        }
        const asientosDisponibles = sala.asientos.filter(asiento => asiento.estado === 'DISPONIBLE');
        if (asientosDisponibles.length === 0) {
            throw new common_1.BadRequestException(`No se puede crear una función en la sala "${sala.nombre}" porque no tiene asientos disponibles. ` +
                `Todos los asientos están dañados o marcados como no existentes.`);
        }
        console.log(`✅ Sala ${sala.nombre} tiene ${asientosDisponibles.length} asientos disponibles`);
        const inicioFuncion = moment.tz(inicio, 'America/Mazatlan');
        const finFuncion = inicioFuncion.clone().add(pelicula.duracionMin + 30, 'minutes');
        console.log(`🔍 Verificando conflictos para sala ${salaId}:`);
        console.log(`  Nueva función: ${inicioFuncion.format()} - ${finFuncion.format()}`);
        console.log(`  Duración película: ${pelicula.duracionMin} minutos`);
        const funcionesExistentes = await this.prisma.funcion.findMany({
            where: {
                salaId,
                cancelada: false,
            },
            include: {
                pelicula: true,
            },
        });
        console.log(`  Funciones existentes en sala: ${funcionesExistentes.length}`);
        const { conflictos, funcionesCercanas } = this.analizarConflictosFunciones(funcionesExistentes, inicioFuncion, finFuncion);
        if (conflictos.length > 0) {
            const salasOcupadas = conflictos.filter(c => c.tipo === 'SALA_OCUPADA');
            const solapamientos = conflictos.filter(c => c.tipo === 'SOLAPAMIENTO');
            let mensaje = '';
            if (salasOcupadas.length > 0) {
                const detalleSalaOcupada = salasOcupadas.map(c => `"${c.pelicula}" ya programada en esta sala para ${c.inicio}`).join(', ');
                mensaje += `🎬 SALA OCUPADA: ${detalleSalaOcupada}. `;
            }
            if (solapamientos.length > 0) {
                const detalleSolapamientos = solapamientos.map(c => `"${c.pelicula}" (${c.inicio} - ${c.fin})`).join(', ');
                mensaje += `🔄 Funciones que se solapan: ${detalleSolapamientos}. `;
            }
            mensaje += `Tu función programada: ${inicioFuncion.format()} - ${finFuncion.format()}`;
            throw new common_1.ConflictException(mensaje);
        }
        if (funcionesCercanas.length > 0 && !forzarCreacion) {
            const detalleCercanas = funcionesCercanas.map(c => `"${c.pelicula}" (${c.inicio}) - Solo ${c.minutos} minutos de separación`).join(', ');
            const mensaje = `⚠️ ADVERTENCIA: Hay funciones muy cercanas: ${detalleCercanas}. Se recomienda dejar al menos 60 minutos entre funciones para limpieza y cambio de audiencia. ¿Deseas continuar de todas formas?`;
            throw new common_1.BadRequestException(mensaje);
        }
        if (funcionesCercanas.length > 0 && forzarCreacion) {
            console.log('⚠️ Creación forzada con funciones cercanas detectadas');
        }
        console.log(`✅ No hay conflictos, creando función...`);
        const funcion = await this.prisma.funcion.create({
            data: {
                peliculaId,
                salaId,
                inicio: inicioFuncion.toDate(),
                precio,
            },
            include: {
                pelicula: true,
                sala: true,
            },
        });
        return funcion;
    }
    async debugConflictos(createFuncionDto) {
        const { peliculaId, salaId, inicio, precio } = createFuncionDto;
        console.log('🐛 === DEBUG DE CONFLICTOS ===');
        console.log('Datos recibidos:', { peliculaId, salaId, inicio, precio });
        const pelicula = await this.prisma.pelicula.findUnique({
            where: { id: peliculaId },
        });
        if (!pelicula) {
            return { error: 'Película no encontrada', pelicula: null };
        }
        const sala = await this.prisma.sala.findUnique({
            where: { id: salaId },
        });
        if (!sala) {
            return { error: 'Sala no encontrada', sala: null };
        }
        const inicioFuncion = moment.tz(inicio, 'America/Mazatlan');
        const finFuncion = inicioFuncion.clone().add(pelicula.duracionMin + 30, 'minutes');
        const funcionesExistentes = await this.prisma.funcion.findMany({
            where: {
                salaId,
                cancelada: false,
            },
            include: {
                pelicula: true,
                sala: true,
            },
        });
        const analisisConflictos = [];
        for (const funcionExistente of funcionesExistentes) {
            const inicioExistente = moment(funcionExistente.inicio);
            const duracionExistente = funcionExistente.pelicula?.duracionMin || 120;
            const finExistente = inicioExistente.clone().add(duracionExistente + 30, 'minutes');
            const haySolapamiento = inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente);
            analisisConflictos.push({
                funcionId: funcionExistente.id,
                pelicula: funcionExistente.pelicula?.titulo,
                inicioExistente: inicioExistente.format(),
                finExistente: finExistente.format(),
                duracionExistente,
                haySolapamiento,
            });
        }
        return {
            datosNuevaFuncion: {
                pelicula: pelicula.titulo,
                sala: sala.nombre,
                inicio: inicioFuncion.format(),
                fin: finFuncion.format(),
                duracion: pelicula.duracionMin,
            },
            funcionesExistentes: funcionesExistentes.length,
            analisisConflictos,
            hayConflictos: analisisConflictos.some(a => a.haySolapamiento),
            mensaje: analisisConflictos.some(a => a.haySolapamiento)
                ? 'Se detectaron conflictos'
                : 'No hay conflictos detectados',
        };
    }
    async findAll(query) {
        const { page = 1, limit = 10, search = '', peliculaId, salaId, desde, hasta, cancelada } = query;
        const skip = (page - 1) * limit;
        let where = {};
        if (search) {
            where = {
                OR: [
                    { pelicula: { titulo: { contains: search, mode: 'insensitive' } } },
                    { sala: { nombre: { contains: search, mode: 'insensitive' } } },
                ],
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
            where.inicio = { ...where.inicio, lte: new Date(hasta) };
        const [funciones, total] = await Promise.all([
            this.prisma.funcion.findMany({
                where,
                include: {
                    pelicula: { select: { id: true, titulo: true, posterUrl: true, duracionMin: true, generos: true, clasificacion: true } },
                    sala: { select: { id: true, nombre: true, filas: true, asientosPorFila: true } },
                    _count: { select: { boletos: true } },
                },
                skip,
                take: limit,
                orderBy: { inicio: 'asc' },
            }),
            this.prisma.funcion.count({ where }),
        ]);
        return (0, pagination_dto_1.createPaginatedResponse)(funciones, total, page, limit);
    }
    async findUpcoming() {
        return this.prisma.funcion.findMany({
            where: {
                inicio: { gt: new Date() },
                cancelada: false,
            },
            include: {
                pelicula: true,
                sala: true,
                _count: {
                    select: {
                        boletos: true,
                    },
                },
            },
            orderBy: { inicio: 'asc' },
        });
    }
    async findOne(id) {
        const funcion = await this.prisma.funcion.findUnique({
            where: { id },
            include: {
                pelicula: true,
                sala: true,
                boletos: {
                    include: {
                        asiento: true,
                        usuario: true,
                    },
                },
                _count: {
                    select: {
                        boletos: true,
                    },
                },
            },
        });
        if (!funcion) {
            throw new common_1.NotFoundException('Función no encontrada');
        }
        return funcion;
    }
    async update(id, updateFuncionDto) {
        const funcionExistente = await this.findOne(id);
        const cambiaHorario = updateFuncionDto.inicio &&
            new Date(updateFuncionDto.inicio).getTime() !== new Date(funcionExistente.inicio).getTime();
        const cambiaSala = updateFuncionDto.salaId && updateFuncionDto.salaId !== funcionExistente.salaId;
        if (cambiaHorario || cambiaSala) {
            console.log('🔍 Validando conflictos en actualización...');
            console.log('  - Fecha anterior:', funcionExistente.inicio);
            console.log('  - Fecha nueva:', updateFuncionDto.inicio);
            console.log('  - Cambio de horario:', cambiaHorario);
            console.log('  - Cambio de sala:', cambiaSala);
            const peliculaId = updateFuncionDto.peliculaId || funcionExistente.peliculaId;
            const salaId = updateFuncionDto.salaId || funcionExistente.salaId;
            const inicio = updateFuncionDto.inicio || funcionExistente.inicio.toISOString();
            await this.validarConflictosParaActualizacion(id, peliculaId, salaId, inicio, updateFuncionDto.forzarActualizacion || false);
        }
        const funcion = await this.prisma.funcion.update({
            where: { id },
            data: updateFuncionDto,
            include: {
                pelicula: true,
                sala: true,
            },
        });
        return funcion;
    }
    async validarConflictosParaActualizacion(funcionId, peliculaId, salaId, inicio, forzarActualizacion = false) {
        const sala = await this.prisma.sala.findUnique({
            where: { id: salaId },
            include: {
                asientos: true,
            },
        });
        if (!sala) {
            throw new common_1.NotFoundException('Sala no encontrada');
        }
        const asientosDisponibles = sala.asientos.filter(asiento => asiento.estado === 'DISPONIBLE');
        if (asientosDisponibles.length === 0) {
            throw new common_1.BadRequestException(`No se puede asignar la función a la sala "${sala.nombre}" porque no tiene asientos disponibles. ` +
                `Todos los asientos están dañados o marcados como no existentes.`);
        }
        console.log(`✅ Sala ${sala.nombre} tiene ${asientosDisponibles.length} asientos disponibles`);
        const pelicula = await this.prisma.pelicula.findUnique({
            where: { id: peliculaId },
        });
        if (!pelicula) {
            throw new common_1.BadRequestException('Película no encontrada');
        }
        const inicioFuncion = moment(inicio);
        const duracionMin = pelicula.duracionMin || 120;
        const finFuncion = inicioFuncion.clone().add(duracionMin + 30, 'minutes');
        const rangoInicio = inicioFuncion.clone().subtract(2, 'hours');
        const rangoFin = inicioFuncion.clone().add(2, 'hours');
        console.log(`  Validando función actualizada: ${inicioFuncion.format()} - ${finFuncion.format()}`);
        const funcionesExistentes = await this.prisma.funcion.findMany({
            where: {
                salaId,
                cancelada: false,
                id: { not: funcionId },
                inicio: {
                    gte: rangoInicio.toDate(),
                    lte: rangoFin.toDate(),
                },
            },
            include: {
                pelicula: { select: { titulo: true, duracionMin: true } },
            },
        });
        console.log(`  Funciones existentes en sala (excluyendo actual): ${funcionesExistentes.length}`);
        const conflictos = [];
        const funcionesCercanas = [];
        for (const funcionExistente of funcionesExistentes) {
            const inicioExistente = moment(funcionExistente.inicio);
            const duracionExistente = funcionExistente.pelicula?.duracionMin || 120;
            const finExistente = inicioExistente.clone().add(duracionExistente + 30, 'minutes');
            console.log(`    Analizando: ${inicioExistente.format()} - ${finExistente.format()}`);
            const mismoHorario = inicioFuncion.isSame(inicioExistente);
            const haySolapamiento = inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente);
            const minutosAntes = inicioFuncion.diff(finExistente, 'minutes');
            const minutosDespues = inicioExistente.diff(finFuncion, 'minutes');
            const estaRealmenteCerca = (minutosAntes >= 0 && minutosAntes < 60) || (minutosDespues >= 0 && minutosDespues < 60);
            if (mismoHorario) {
                console.log(`    ❌ HORARIO IDÉNTICO con función ${funcionExistente.id}`);
                conflictos.push({
                    id: funcionExistente.id,
                    inicio: inicioExistente.format(),
                    fin: finExistente.format(),
                    pelicula: funcionExistente.pelicula?.titulo,
                    tipo: 'HORARIO_IDENTICO',
                });
            }
            else if (haySolapamiento) {
                console.log(`    ❌ SOLAPAMIENTO DIRECTO con función ${funcionExistente.id}`);
                conflictos.push({
                    id: funcionExistente.id,
                    inicio: inicioExistente.format(),
                    fin: finExistente.format(),
                    pelicula: funcionExistente.pelicula?.titulo,
                    tipo: 'SOLAPAMIENTO',
                });
            }
            else if (estaRealmenteCerca) {
                const minutosSeparacion = Math.min(minutosAntes >= 0 ? minutosAntes : 999, minutosDespues >= 0 ? minutosDespues : 999);
                console.log(`    ⚠️ FUNCIÓN CERCA con función ${funcionExistente.id} (${minutosSeparacion} min de separación)`);
                funcionesCercanas.push({
                    id: funcionExistente.id,
                    inicio: inicioExistente.format(),
                    fin: finExistente.format(),
                    pelicula: funcionExistente.pelicula?.titulo,
                    minutos: minutosSeparacion
                });
            }
            else {
                console.log(`    ✅ Sin problemas`);
            }
        }
        if (conflictos.length > 0) {
            const salasOcupadas = conflictos.filter(c => c.tipo === 'SALA_OCUPADA');
            const solapamientos = conflictos.filter(c => c.tipo === 'SOLAPAMIENTO');
            let mensaje = 'Error al actualizar: ';
            if (salasOcupadas.length > 0) {
                const detalleSalaOcupada = salasOcupadas.map(c => `"${c.pelicula}" ya ocupa esta sala en ${c.inicio}`).join(', ');
                mensaje += `🎬 SALA OCUPADA: ${detalleSalaOcupada}. `;
            }
            if (solapamientos.length > 0) {
                const detalleSolapamientos = solapamientos.map(c => `"${c.pelicula}" (${c.inicio} - ${c.fin})`).join(', ');
                mensaje += `🔄 Funciones que se solapan: ${detalleSolapamientos}. `;
            }
            mensaje += `Nueva función programada: ${inicioFuncion.format()} - ${finFuncion.format()}`;
            throw new common_1.ConflictException(mensaje);
        }
        if (funcionesCercanas.length > 0 && !forzarActualizacion) {
            const detalleCercanas = funcionesCercanas.map(c => `"${c.pelicula}" (${c.inicio}) - Solo ${c.minutos} minutos de separación`).join(', ');
            const mensaje = `⚠️ ADVERTENCIA: Hay funciones muy cercanas: ${detalleCercanas}. Se recomienda dejar al menos 60 minutos entre funciones para limpieza y cambio de audiencia. ¿Deseas continuar de todas formas?`;
            throw new common_1.BadRequestException(mensaje);
        }
        if (funcionesCercanas.length > 0 && forzarActualizacion) {
            console.log('⚠️ Actualización forzada con funciones cercanas detectadas');
        }
        console.log(`✅ No hay conflictos para la actualización`);
    }
    analizarConflictosFunciones(funcionesExistentes, inicioFuncion, finFuncion) {
        const conflictos = [];
        const funcionesCercanas = [];
        for (const funcionExistente of funcionesExistentes) {
            const inicioExistente = moment(funcionExistente.inicio);
            const duracionExistente = funcionExistente.pelicula?.duracionMin || 120;
            const finExistente = inicioExistente.clone().add(duracionExistente + 30, 'minutes');
            console.log(`    Analizando: ${inicioExistente.format()} - ${finExistente.format()} - "${funcionExistente.pelicula?.titulo}"`);
            const mismoHorario = inicioFuncion.isSame(inicioExistente);
            const haySolapamiento = inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente);
            const minutosAntes = inicioFuncion.diff(finExistente, 'minutes');
            const minutosDespues = inicioExistente.diff(finFuncion, 'minutes');
            const estaRealmenteCerca = (minutosAntes >= 0 && minutosAntes < 60) || (minutosDespues >= 0 && minutosDespues < 60);
            if (mismoHorario) {
                console.log(`    ❌ SALA OCUPADA: "${funcionExistente.pelicula?.titulo}" ya programada en mismo horario`);
                conflictos.push({
                    id: funcionExistente.id,
                    inicio: inicioExistente.format(),
                    fin: finExistente.format(),
                    pelicula: funcionExistente.pelicula?.titulo,
                    peliculaId: funcionExistente.peliculaId,
                    tipo: 'SALA_OCUPADA',
                });
            }
            else if (haySolapamiento) {
                console.log(`    ❌ SOLAPAMIENTO DIRECTO con función ${funcionExistente.id}`);
                conflictos.push({
                    id: funcionExistente.id,
                    inicio: inicioExistente.format(),
                    fin: finExistente.format(),
                    pelicula: funcionExistente.pelicula?.titulo,
                    tipo: 'SOLAPAMIENTO',
                });
            }
            else if (estaRealmenteCerca) {
                const minutosSeparacion = Math.min(minutosAntes >= 0 ? minutosAntes : 999, minutosDespues >= 0 ? minutosDespues : 999);
                console.log(`    ⚠️ FUNCIÓN CERCA con función ${funcionExistente.id} (${minutosSeparacion} min de separación)`);
                funcionesCercanas.push({
                    id: funcionExistente.id,
                    inicio: inicioExistente.format(),
                    fin: finExistente.format(),
                    pelicula: funcionExistente.pelicula?.titulo,
                    minutos: minutosSeparacion
                });
            }
            else {
                console.log(`    ✅ Sin problemas`);
            }
        }
        return { conflictos, funcionesCercanas };
    }
    async cancelar(id) {
        const funcion = await this.findOne(id);
        if (funcion.cancelada) {
            throw new common_1.BadRequestException('La función ya está cancelada');
        }
        const boletosPagados = await this.prisma.boleto.findFirst({
            where: {
                funcionId: id,
                estado: 'PAGADO',
            },
        });
        if (boletosPagados) {
            throw new common_1.BadRequestException('No se puede cancelar una función con boletos pagados');
        }
        const funcionCancelada = await this.prisma.funcion.update({
            where: { id },
            data: { cancelada: true },
            include: {
                pelicula: true,
                sala: true,
            },
        });
        return { message: 'Función cancelada exitosamente', funcion: funcionCancelada };
    }
    async reactivar(id) {
        const funcion = await this.findOne(id);
        if (!funcion.cancelada) {
            throw new common_1.BadRequestException('La función ya está activa');
        }
        const pelicula = await this.prisma.pelicula.findUnique({
            where: { id: funcion.peliculaId },
        });
        if (!pelicula) {
            throw new common_1.NotFoundException('Película no encontrada');
        }
        const inicioFuncion = moment.tz(funcion.inicio, 'America/Mazatlan');
        const finFuncion = inicioFuncion.clone().add(pelicula.duracionMin + 30, 'minutes');
        const funcionesExistentes = await this.prisma.funcion.findMany({
            where: {
                salaId: funcion.salaId,
                cancelada: false,
                id: { not: id },
            },
            include: {
                pelicula: true,
            },
        });
        for (const funcionExistente of funcionesExistentes) {
            const inicioExistente = moment.tz(funcionExistente.inicio, 'America/Mazatlan');
            const finExistente = inicioExistente.clone().add(funcionExistente.pelicula.duracionMin + 30, 'minutes');
            if ((inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente))) {
                throw new common_1.ConflictException(`Conflicto de horario con función existente. ` +
                    `Función existente: ${inicioExistente.format('DD/MM/YYYY HH:mm')} - ${finExistente.format('HH:mm')}`);
            }
        }
        const funcionReactivada = await this.prisma.funcion.update({
            where: { id },
            data: { cancelada: false },
            include: {
                pelicula: true,
                sala: true,
            },
        });
        return { message: 'Función reactivada exitosamente', funcion: funcionReactivada };
    }
    async remove(id) {
        await this.findOne(id);
        const boletosVendidos = await this.prisma.boleto.findFirst({
            where: { funcionId: id },
        });
        if (boletosVendidos) {
            throw new common_1.BadRequestException('No se puede eliminar una función con boletos vendidos');
        }
        await this.prisma.funcion.delete({
            where: { id },
        });
        return { message: 'Función eliminada exitosamente' };
    }
    async findByPelicula(peliculaId) {
        return this.prisma.funcion.findMany({
            where: {
                peliculaId,
                inicio: { gt: new Date() },
                cancelada: false,
            },
            include: {
                sala: true,
                _count: {
                    select: {
                        boletos: true,
                    },
                },
            },
            orderBy: { inicio: 'asc' },
        });
    }
    async findBySala(salaId) {
        return this.prisma.funcion.findMany({
            where: {
                salaId,
                inicio: { gt: new Date() },
                cancelada: false,
            },
            include: {
                pelicula: true,
                _count: {
                    select: {
                        boletos: true,
                    },
                },
            },
            orderBy: { inicio: 'asc' },
        });
    }
};
exports.FuncionesService = FuncionesService;
exports.FuncionesService = FuncionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FuncionesService);
//# sourceMappingURL=funciones.service.js.map