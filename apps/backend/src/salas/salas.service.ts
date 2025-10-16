import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { UpdateAsientosDanadosDto } from './dto/update-asientos-danados.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class SalasService {
  constructor(private prisma: PrismaService) {}

  async create(createSalaDto: CreateSalaDto) {
    const { nombre, filas, asientosPorFila } = createSalaDto;

    // Crear la sala
    const sala = await this.prisma.sala.create({
      data: {
        nombre,
        filas,
        asientosPorFila,
      },
    });

    // Generar todos los asientos para la sala
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

    // Crear todos los asientos en batch
    await this.prisma.asiento.createMany({
      data: asientos,
    });

    return sala;
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, search = '' } = query;
    const skip = (page - 1) * limit;

    let where: any = {};
    
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

    return createPaginatedResponse(salas, total, page, limit);
  }

  async findOne(id: string) {
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
      throw new NotFoundException('Sala no encontrada');
    }

    return sala;
  }

  async update(id: string, updateSalaDto: UpdateSalaDto) {
    console.log('🏢 SalasService.update - Recibido:', { id, updateSalaDto });
    console.log('🏢 Tipos de datos recibidos:', {
      nombre: typeof updateSalaDto.nombre,
      filas: typeof updateSalaDto.filas,
      asientosPorFila: typeof updateSalaDto.asientosPorFila,
      filasValue: updateSalaDto.filas,
      asientosPorFilaValue: updateSalaDto.asientosPorFila
    });

    // Crear objeto de actualización simple
    const updateData: any = {};
    
    // Agregar campos si están presentes
    if (updateSalaDto.nombre !== undefined) updateData.nombre = updateSalaDto.nombre;
    if (updateSalaDto.filas !== undefined) updateData.filas = updateSalaDto.filas;
    if (updateSalaDto.asientosPorFila !== undefined) updateData.asientosPorFila = updateSalaDto.asientosPorFila;
    
    console.log('🏢 Datos preparados para actualizar:', updateData);

    // Verificar si la sala existe
    const salaExistente = await this.findOne(id);
    console.log('🏢 Sala existente encontrada:', salaExistente);

    // Si se cambian las dimensiones, regenerar asientos
    if (updateSalaDto.filas !== undefined || updateSalaDto.asientosPorFila !== undefined) {
      const nuevasFilas = updateSalaDto.filas ?? salaExistente.filas;
      const nuevosAsientosPorFila = updateSalaDto.asientosPorFila ?? salaExistente.asientosPorFila;

      console.log('🏢 Actualizando dimensiones:', { nuevasFilas, nuevosAsientosPorFila });

      // Verificar que no haya funciones programadas
      const funcionesProgramadas = await this.prisma.funcion.findFirst({
        where: {
          salaId: id,
          inicio: { gt: new Date() },
        },
      });

      if (funcionesProgramadas) {
        throw new BadRequestException('No se puede modificar una sala con funciones programadas');
      }

      // Eliminar asientos existentes
      await this.prisma.asiento.deleteMany({
        where: { salaId: id },
      });

      // Generar nuevos asientos
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

      // Crear nuevos asientos
      await this.prisma.asiento.createMany({
        data: asientos,
      });

      // Agregar filas y asientosPorFila al updateData
      updateData.filas = nuevasFilas;
      updateData.asientosPorFila = nuevosAsientosPorFila;
    } else {
      // Si no se cambian las dimensiones, pero se incluyen en el DTO, agregarlas  
      console.log('🏢 No se regeneran asientos, solo se actualizan campos');
    }

    console.log('🏢 Datos a actualizar:', updateData);

    // Actualizar la sala
    const sala = await this.prisma.sala.update({
      where: { id },
      data: updateData,
    });

    console.log('🏢 Sala actualizada:', sala);
    return sala;
  }

  async remove(id: string) {
    // Verificar si la sala existe
    await this.findOne(id);

    // Verificar que no haya funciones programadas
    const funcionesProgramadas = await this.prisma.funcion.findFirst({
      where: {
        salaId: id,
        inicio: { gt: new Date() },
      },
    });

    if (funcionesProgramadas) {
      throw new BadRequestException('No se puede eliminar una sala con funciones programadas');
    }

    // Eliminar la sala (los asientos se eliminan en cascade)
    await this.prisma.sala.delete({
      where: { id },
    });

    return { message: 'Sala eliminada exitosamente' };
  }

  async updateAsientosDanados(id: string, updateAsientosDanadosDto: UpdateAsientosDanadosDto) {
    const { asientosDanados } = updateAsientosDanadosDto;

    console.log('🔧 Actualizando asientos dañados para sala:', id);
    console.log('🔧 Asientos a marcar como dañados:', asientosDanados);

    // Verificar si la sala existe
    const sala = await this.findOne(id);

    // PASO 1: Marcar TODOS los asientos de la sala como DISPONIBLES
    console.log('🔧 Paso 1: Restaurando todos los asientos a DISPONIBLE');
    await this.prisma.asiento.updateMany({
      where: {
        salaId: id,
      },
      data: {
        estado: 'DISPONIBLE',
      },
    });

    // PASO 2: Marcar solo los asientos seleccionados como DANADOS
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

    // Verificar el estado final
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

  async getAsientosDisponibilidad(salaId: string, funcionId: string) {
    const sala = await this.findOne(salaId);

    // Obtener asientos ocupados para la función
    // Incluir RESERVADO, PAGADO y VALIDADO (asientos ocupados o ya usados)
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

    // Mapear estado de cada asiento
    const asientosConEstado = sala.asientos.map(asiento => ({
      ...asiento,
      disponible: !asientosOcupadosIds.includes(asiento.id) && asiento.estado === 'DISPONIBLE',
    }));

    return asientosConEstado;
  }
}
