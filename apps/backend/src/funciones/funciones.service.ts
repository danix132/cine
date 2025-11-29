import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { UpdateFuncionDto } from './dto/update-funcion.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginatedResponse } from '../common/dto/pagination.dto';
import * as moment from 'moment-timezone';

@Injectable()
export class FuncionesService {
  constructor(private prisma: PrismaService) {}

  async create(createFuncionDto: CreateFuncionDto) {
    const { peliculaId, salaId, inicio, precio, forzarCreacion = false } = createFuncionDto;

    // Verificar que la película existe y esté activa
    const pelicula = await this.prisma.pelicula.findUnique({
      where: { id: peliculaId },
    });

    if (!pelicula) {
      throw new NotFoundException('Película no encontrada');
    }

    if (pelicula.estado !== 'ACTIVA') {
      throw new BadRequestException('Solo se pueden crear funciones para películas activas');
    }

    // Verificar que la sala existe
    const sala = await this.prisma.sala.findUnique({
      where: { id: salaId },
      include: {
        asientos: true,
      },
    });

    if (!sala) {
      throw new NotFoundException('Sala no encontrada');
    }

    // Verificar que la sala tenga al menos un asiento disponible
    const asientosDisponibles = sala.asientos.filter(
      asiento => asiento.estado === 'DISPONIBLE'
    );

    if (asientosDisponibles.length === 0) {
      throw new BadRequestException(
        `No se puede crear una función en la sala "${sala.nombre}" porque no tiene asientos disponibles. ` +
        `Todos los asientos están dañados o marcados como no existentes.`
      );
    }

    console.log(`✅ Sala ${sala.nombre} tiene ${asientosDisponibles.length} asientos disponibles`);

    // Verificar que no haya conflictos de horario en la misma sala
    const inicioFuncion = moment.tz(inicio, 'America/Mazatlan');
    const finFuncion = inicioFuncion.clone().add(pelicula.duracionMin + 30, 'minutes'); // Agregar 30 min buffer

    console.log(`🔍 Verificando conflictos para sala ${salaId}:`);
    console.log(`  Nueva función: ${inicioFuncion.format()} - ${finFuncion.format()}`);
    console.log(`  Duración película: ${pelicula.duracionMin} minutos`);

    // Obtener todas las funciones activas en la misma sala
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

    // Usar el mismo algoritmo que para actualización
    const { conflictos, funcionesCercanas } = this.analizarConflictosFunciones(funcionesExistentes, inicioFuncion, finFuncion);

    // Primero verificar conflictos directos (errores que impiden crear)
    if (conflictos.length > 0) {
      const salasOcupadas = conflictos.filter(c => c.tipo === 'SALA_OCUPADA');
      const solapamientos = conflictos.filter(c => c.tipo === 'SOLAPAMIENTO');
      
      let mensaje = '';
      
      if (salasOcupadas.length > 0) {
        const detalleSalaOcupada = salasOcupadas.map(c => 
          `"${c.pelicula}" ya programada en esta sala para ${c.inicio}`
        ).join(', ');
        mensaje += `🎬 SALA OCUPADA: ${detalleSalaOcupada}. `;
      }
      
      if (solapamientos.length > 0) {
        const detalleSolapamientos = solapamientos.map(c => 
          `"${c.pelicula}" (${c.inicio} - ${c.fin})`
        ).join(', ');
        mensaje += `🔄 Funciones que se solapan: ${detalleSolapamientos}. `;
      }
      
      mensaje += `Tu función programada: ${inicioFuncion.format()} - ${finFuncion.format()}`;
      
      throw new ConflictException(mensaje);
    }
    
    // Si no hay conflictos directos pero sí funciones cercanas, lanzar advertencia (a menos que se fuerce)
    if (funcionesCercanas.length > 0 && !forzarCreacion) {
      const detalleCercanas = funcionesCercanas.map(c => 
        `"${c.pelicula}" (${c.inicio}) - Solo ${c.minutos} minutos de separación`
      ).join(', ');
      
      const mensaje = `⚠️ ADVERTENCIA: Hay funciones muy cercanas: ${detalleCercanas}. Se recomienda dejar al menos 60 minutos entre funciones para limpieza y cambio de audiencia. ¿Deseas continuar de todas formas?`;
      
      throw new BadRequestException(mensaje);
    }
    
    if (funcionesCercanas.length > 0 && forzarCreacion) {
      console.log('⚠️ Creación forzada con funciones cercanas detectadas');
    }

    console.log(`✅ No hay conflictos, creando función...`);

    // Crear la función
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

  async debugConflictos(createFuncionDto: CreateFuncionDto) {
    const { peliculaId, salaId, inicio, precio } = createFuncionDto;

    console.log('🐛 === DEBUG DE CONFLICTOS ===');
    console.log('Datos recibidos:', { peliculaId, salaId, inicio, precio });

    // Verificar que la película existe y esté activa
    const pelicula = await this.prisma.pelicula.findUnique({
      where: { id: peliculaId },
    });

    if (!pelicula) {
      return { error: 'Película no encontrada', pelicula: null };
    }

    // Verificar que la sala existe
    const sala = await this.prisma.sala.findUnique({
      where: { id: salaId },
    });

    if (!sala) {
      return { error: 'Sala no encontrada', sala: null };
    }

    const inicioFuncion = moment.tz(inicio, 'America/Mazatlan');
    const finFuncion = inicioFuncion.clone().add(pelicula.duracionMin + 30, 'minutes');

    // Obtener todas las funciones activas en la misma sala
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

  async findAll(query: any) {
    const { page = 1, limit = 10, search = '', peliculaId, salaId, desde, hasta, cancelada } = query;
    const skip = (page - 1) * limit;

    let where: any = {};
    
    if (search) {
      where = {
        OR: [
          { pelicula: { titulo: { contains: search, mode: 'insensitive' } } },
          { sala: { nombre: { contains: search, mode: 'insensitive' } } },
        ],
      };
    }

    if (peliculaId) where.peliculaId = peliculaId;
    if (salaId) where.salaId = salaId;
    if (cancelada !== undefined) where.cancelada = cancelada;
    if (desde) where.inicio = { gte: new Date(desde) };
    if (hasta) where.inicio = { ...where.inicio, lte: new Date(hasta) };

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

    return createPaginatedResponse(funciones, total, page, limit);
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

  async findOne(id: string) {
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
      throw new NotFoundException('Función no encontrada');
    }

    return funcion;
  }

  async update(id: string, updateFuncionDto: UpdateFuncionDto) {
    // Verificar si la función existe
    const funcionExistente = await this.findOne(id);

    // Si se actualizan datos que afectan el horario o la sala, validar conflictos
    const cambiaHorario = updateFuncionDto.inicio && 
      new Date(updateFuncionDto.inicio).getTime() !== new Date(funcionExistente.inicio).getTime();
    const cambiaSala = updateFuncionDto.salaId && updateFuncionDto.salaId !== funcionExistente.salaId;

    if (cambiaHorario || cambiaSala) {
      console.log('🔍 Validando conflictos en actualización...');
      console.log('  - Fecha anterior:', funcionExistente.inicio);
      console.log('  - Fecha nueva:', updateFuncionDto.inicio);
      console.log('  - Cambio de horario:', cambiaHorario);
      console.log('  - Cambio de sala:', cambiaSala);
      
      // Obtener datos para validación
      const peliculaId = updateFuncionDto.peliculaId || funcionExistente.peliculaId;
      const salaId = updateFuncionDto.salaId || funcionExistente.salaId;
      const inicio = updateFuncionDto.inicio || funcionExistente.inicio.toISOString();

      // Validar conflictos usando el mismo algoritmo que create, pero excluyendo la función actual
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

  private async validarConflictosParaActualizacion(funcionId: string, peliculaId: string, salaId: string, inicio: string, forzarActualizacion: boolean = false) {
    // Verificar que la sala tenga asientos disponibles
    const sala = await this.prisma.sala.findUnique({
      where: { id: salaId },
      include: {
        asientos: true,
      },
    });

    if (!sala) {
      throw new NotFoundException('Sala no encontrada');
    }

    const asientosDisponibles = sala.asientos.filter(
      asiento => asiento.estado === 'DISPONIBLE'
    );

    if (asientosDisponibles.length === 0) {
      throw new BadRequestException(
        `No se puede asignar la función a la sala "${sala.nombre}" porque no tiene asientos disponibles. ` +
        `Todos los asientos están dañados o marcados como no existentes.`
      );
    }

    console.log(`✅ Sala ${sala.nombre} tiene ${asientosDisponibles.length} asientos disponibles`);

    // Obtener información de la película para calcular duración
    const pelicula = await this.prisma.pelicula.findUnique({
      where: { id: peliculaId },
    });

    if (!pelicula) {
      throw new BadRequestException('Película no encontrada');
    }

    const inicioFuncion = moment(inicio);
    const duracionMin = pelicula.duracionMin || 120;
    const finFuncion = inicioFuncion.clone().add(duracionMin + 30, 'minutes'); // Buffer de 30 min
    
    // Rangos más amplios para detectar funciones cercanas (2 horas antes y después)
    const rangoInicio = inicioFuncion.clone().subtract(2, 'hours');
    const rangoFin = inicioFuncion.clone().add(2, 'hours');

    console.log(`  Validando función actualizada: ${inicioFuncion.format()} - ${finFuncion.format()}`);

    // Buscar funciones en la misma sala (excluyendo la función que se está actualizando)
    const funcionesExistentes = await this.prisma.funcion.findMany({
      where: {
        salaId,
        cancelada: false,
        id: { not: funcionId }, // Excluir la función que se está actualizando
        inicio: {
          gte: rangoInicio.toDate(), // 2 horas antes
          lte: rangoFin.toDate(),    // 2 horas después
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
      const finExistente = inicioExistente.clone().add(duracionExistente + 30, 'minutes'); // Buffer de 30 min

      console.log(`    Analizando: ${inicioExistente.format()} - ${finExistente.format()}`);

      // Verificar si es exactamente el mismo horario
      const mismoHorario = inicioFuncion.isSame(inicioExistente);
      
      // Verificar si hay solapamiento directo
      const haySolapamiento = inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente);
      
      // Verificar si está cerca (menos de 60 minutos de diferencia)
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
      } else if (haySolapamiento) {
        console.log(`    ❌ SOLAPAMIENTO DIRECTO con función ${funcionExistente.id}`);
        conflictos.push({
          id: funcionExistente.id,
          inicio: inicioExistente.format(),
          fin: finExistente.format(),
          pelicula: funcionExistente.pelicula?.titulo,
          tipo: 'SOLAPAMIENTO',
        });
      } else if (estaRealmenteCerca) {
        const minutosSeparacion = Math.min(
          minutosAntes >= 0 ? minutosAntes : 999, 
          minutosDespues >= 0 ? minutosDespues : 999
        );
        console.log(`    ⚠️ FUNCIÓN CERCA con función ${funcionExistente.id} (${minutosSeparacion} min de separación)`);
        funcionesCercanas.push({
          id: funcionExistente.id,
          inicio: inicioExistente.format(),
          fin: finExistente.format(),
          pelicula: funcionExistente.pelicula?.titulo,
          minutos: minutosSeparacion
        });
      } else {
        console.log(`    ✅ Sin problemas`);
      }
    }

    // Primero verificar conflictos directos (errores que impiden guardar)
    if (conflictos.length > 0) {
      const salasOcupadas = conflictos.filter(c => c.tipo === 'SALA_OCUPADA');
      const solapamientos = conflictos.filter(c => c.tipo === 'SOLAPAMIENTO');
      
      let mensaje = 'Error al actualizar: ';
      
      if (salasOcupadas.length > 0) {
        const detalleSalaOcupada = salasOcupadas.map(c => 
          `"${c.pelicula}" ya ocupa esta sala en ${c.inicio}`
        ).join(', ');
        mensaje += `🎬 SALA OCUPADA: ${detalleSalaOcupada}. `;
      }
      
      if (solapamientos.length > 0) {
        const detalleSolapamientos = solapamientos.map(c => 
          `"${c.pelicula}" (${c.inicio} - ${c.fin})`
        ).join(', ');
        mensaje += `🔄 Funciones que se solapan: ${detalleSolapamientos}. `;
      }
      
      mensaje += `Nueva función programada: ${inicioFuncion.format()} - ${finFuncion.format()}`;
      
      throw new ConflictException(mensaje);
    }
    
    // Si no hay conflictos directos pero sí funciones cercanas, lanzar advertencia (a menos que se fuerce)
    if (funcionesCercanas.length > 0 && !forzarActualizacion) {
      const detalleCercanas = funcionesCercanas.map(c => 
        `"${c.pelicula}" (${c.inicio}) - Solo ${c.minutos} minutos de separación`
      ).join(', ');
      
      const mensaje = `⚠️ ADVERTENCIA: Hay funciones muy cercanas: ${detalleCercanas}. Se recomienda dejar al menos 60 minutos entre funciones para limpieza y cambio de audiencia. ¿Deseas continuar de todas formas?`;
      
      // Usar status 400 para advertencias que requieren confirmación del usuario
      throw new BadRequestException(mensaje);
    }
    
    if (funcionesCercanas.length > 0 && forzarActualizacion) {
      console.log('⚠️ Actualización forzada con funciones cercanas detectadas');
    }

    console.log(`✅ No hay conflictos para la actualización`);
  }

  private analizarConflictosFunciones(funcionesExistentes: any[], inicioFuncion: any, finFuncion: any) {
    const conflictos = [];
    const funcionesCercanas = [];
    
    for (const funcionExistente of funcionesExistentes) {
      const inicioExistente = moment(funcionExistente.inicio);
      const duracionExistente = funcionExistente.pelicula?.duracionMin || 120;
      const finExistente = inicioExistente.clone().add(duracionExistente + 30, 'minutes'); // Buffer de 30 min

      console.log(`    Analizando: ${inicioExistente.format()} - ${finExistente.format()} - "${funcionExistente.pelicula?.titulo}"`);

      // Verificar si es exactamente el mismo horario
      const mismoHorario = inicioFuncion.isSame(inicioExistente);
      
      // Verificar si hay solapamiento directo
      const haySolapamiento = inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente);
      
      // Verificar si está cerca (menos de 60 minutos de diferencia)
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
      } else if (haySolapamiento) {
        console.log(`    ❌ SOLAPAMIENTO DIRECTO con función ${funcionExistente.id}`);
        conflictos.push({
          id: funcionExistente.id,
          inicio: inicioExistente.format(),
          fin: finExistente.format(),
          pelicula: funcionExistente.pelicula?.titulo,
          tipo: 'SOLAPAMIENTO',
        });
      } else if (estaRealmenteCerca) {
        const minutosSeparacion = Math.min(
          minutosAntes >= 0 ? minutosAntes : 999, 
          minutosDespues >= 0 ? minutosDespues : 999
        );
        console.log(`    ⚠️ FUNCIÓN CERCA con función ${funcionExistente.id} (${minutosSeparacion} min de separación)`);
        funcionesCercanas.push({
          id: funcionExistente.id,
          inicio: inicioExistente.format(),
          fin: finExistente.format(),
          pelicula: funcionExistente.pelicula?.titulo,
          minutos: minutosSeparacion
        });
      } else {
        console.log(`    ✅ Sin problemas`);
      }
    }

    return { conflictos, funcionesCercanas };
  }

  async cancelar(id: string) {
    // Verificar si la función existe
    const funcion = await this.findOne(id);

    if (funcion.cancelada) {
      throw new BadRequestException('La función ya está cancelada');
    }

    // Verificar que no haya boletos pagados
    const boletosPagados = await this.prisma.boleto.findFirst({
      where: {
        funcionId: id,
        estado: 'PAGADO',
      },
    });

    if (boletosPagados) {
      throw new BadRequestException('No se puede cancelar una función con boletos pagados');
    }

    // Cancelar la función
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

  async reactivar(id: string) {
    // Verificar si la función existe
    const funcion = await this.findOne(id);

    if (!funcion.cancelada) {
      throw new BadRequestException('La función ya está activa');
    }

    // Verificar que no haya conflictos de horario al reactivar
    const pelicula = await this.prisma.pelicula.findUnique({
      where: { id: funcion.peliculaId },
    });

    if (!pelicula) {
      throw new NotFoundException('Película no encontrada');
    }

    // Verificar conflictos de horario
    const inicioFuncion = moment.tz(funcion.inicio, 'America/Mazatlan');
    const finFuncion = inicioFuncion.clone().add(pelicula.duracionMin + 30, 'minutes');

    const funcionesExistentes = await this.prisma.funcion.findMany({
      where: {
        salaId: funcion.salaId,
        cancelada: false,
        id: { not: id }, // Excluir la función actual
      },
      include: {
        pelicula: true,
      },
    });

    for (const funcionExistente of funcionesExistentes) {
      const inicioExistente = moment.tz(funcionExistente.inicio, 'America/Mazatlan');
      const finExistente = inicioExistente.clone().add(funcionExistente.pelicula.duracionMin + 30, 'minutes');

      if (
        (inicioFuncion.isBefore(finExistente) && finFuncion.isAfter(inicioExistente))
      ) {
        throw new ConflictException(
          `Conflicto de horario con función existente. ` +
          `Función existente: ${inicioExistente.format('DD/MM/YYYY HH:mm')} - ${finExistente.format('HH:mm')}`
        );
      }
    }

    // Reactivar la función
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

  async remove(id: string) {
    // Verificar si la función existe
    await this.findOne(id);

    // Verificar que no haya boletos vendidos
    const boletosVendidos = await this.prisma.boleto.findFirst({
      where: { funcionId: id },
    });

    if (boletosVendidos) {
      throw new BadRequestException('No se puede eliminar una función con boletos vendidos');
    }

    await this.prisma.funcion.delete({
      where: { id },
    });

    return { message: 'Función eliminada exitosamente' };
  }

  async findByPelicula(peliculaId: string) {
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

  async findBySala(salaId: string) {
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
}
