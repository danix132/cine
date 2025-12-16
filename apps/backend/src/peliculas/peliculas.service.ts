import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class PeliculasService {
  constructor(private prisma: PrismaService) {}

  async create(createPeliculaDto: CreatePeliculaDto) {
    const pelicula = await this.prisma.pelicula.create({
      data: createPeliculaDto,
    });

    return pelicula;
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, search = '', estado, genero } = query;
    const skip = (page - 1) * limit;

    let where: any = {};
    
    if (search) {
      where = {
        OR: [
          { titulo: { contains: search, mode: 'insensitive' } },
          { sinopsis: { contains: search, mode: 'insensitive' } },
          { generos: { hasSome: [search] } },
        ],
      };
    }

    if (estado) where.estado = estado;
    if (genero) where.generos = { hasSome: [genero] };

    const [peliculas, total] = await Promise.all([
      this.prisma.pelicula.findMany({
        where,
        include: {
          _count: { select: { funciones: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Ordenar por fecha de creación, más recientes primero
      }),
      this.prisma.pelicula.count({ where }),
    ]);

    return createPaginatedResponse(peliculas, total, page, limit);
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

  async findOne(id: string) {
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
      throw new NotFoundException('Película no encontrada');
    }

    return pelicula;
  }

  async update(id: string, updatePeliculaDto: UpdatePeliculaDto) {
    // Verificar si la película existe
    await this.findOne(id);

    const pelicula = await this.prisma.pelicula.update({
      where: { id },
      data: updatePeliculaDto,
    });

    return pelicula;
  }

  async remove(id: string) {
    // Verificar si la película existe
    const peliculaExistente = await this.findOne(id);

    // Contar todas las funciones (pasadas y futuras)
    const totalFunciones = await this.prisma.funcion.count({
      where: { peliculaId: id },
    });

    // Contar funciones programadas para el futuro
    const funcionesProgramadas = await this.prisma.funcion.count({
      where: {
        peliculaId: id,
        inicio: { gt: new Date() },
        cancelada: false,
      },
    });

    // Contar boletos vendidos (incluye VALIDADO porque ya fueron usados)
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

    // Si tiene boletos vendidos o funciones programadas, no se puede eliminar completamente
    if (boletosVendidos > 0 || funcionesProgramadas > 0) {
      let razon = [];
      if (boletosVendidos > 0) razon.push(`${boletosVendidos} boleto(s) vendido(s)`);
      if (funcionesProgramadas > 0) razon.push(`${funcionesProgramadas} función(es) programada(s)`);
      
      throw new BadRequestException(
        `No se puede eliminar completamente la película "${peliculaExistente.titulo}" porque tiene ${razon.join(' y ')}.`
      );
    }

    // Si no tiene funciones ni boletos, eliminar completamente
    if (totalFunciones === 0) {
      await this.prisma.pelicula.delete({
        where: { id },
      });

      console.log(`🗑️ Película "${peliculaExistente.titulo}" eliminada COMPLETAMENTE de la base de datos`);

      return { 
        message: `Película "${peliculaExistente.titulo}" eliminada COMPLETAMENTE de la base de datos`, 
        eliminacionCompleta: true
      };
    } else {
      // Si tiene funciones pasadas pero sin boletos ni funciones futuras, también eliminar completamente
      // Primero eliminar las funciones pasadas
      await this.prisma.funcion.deleteMany({
        where: { peliculaId: id }
      });

      // Luego eliminar la película
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

  async forceRemove(id: string) {
    // Verificar si la película existe
    const peliculaExistente = await this.findOne(id);

    console.log(`🚨 ELIMINACIÓN FORZADA - Película ${id}:`, {
      peliculaId: id,
      titulo: peliculaExistente.titulo,
      warning: 'ELIMINACIÓN COMPLETA INCLUYENDO TODOS LOS DATOS RELACIONADOS'
    });

    // Usar una transacción para eliminar todo de manera segura
    const resultado = await this.prisma.$transaction(async (prisma) => {
      // 1. Obtener todos los IDs de boletos relacionados con esta película
      const boletosRelacionados = await prisma.boleto.findMany({
        where: { funcion: { peliculaId: id } },
        select: { id: true }
      });

      const idsBoletosRelacionados = boletosRelacionados.map(b => b.id);

      // 2. Eliminar items de carrito que referencian estos boletos
      const itemsCarritoEliminados = await prisma.carritoItem.deleteMany({
        where: { 
          tipo: 'BOLETO',
          referenciaId: { in: idsBoletosRelacionados }
        }
      });

      // 3. Eliminar items de pedido que referencian estos boletos
      const itemsPedidoEliminados = await prisma.pedidoItem.deleteMany({
        where: { 
          tipo: 'BOLETO',
          referenciaId: { in: idsBoletosRelacionados }
        }
      });

      // 4. Los boletos se eliminan automáticamente por CASCADE cuando eliminamos las funciones
      // 5. Las funciones se eliminan automáticamente por CASCADE cuando eliminamos la película
      
      // 6. Finalmente eliminar la película (esto eliminará funciones y boletos por CASCADE)
      await prisma.pelicula.delete({
        where: { id }
      });

      return {
        boletosAfectados: idsBoletosRelacionados.length,
        itemsCarritoEliminados: itemsCarritoEliminados.count,
        itemsPedidoEliminados: itemsPedidoEliminados.count,
        // Las funciones y boletos se cuentan por CASCADE
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

  async findByGenero(genero: string) {
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

  async getPeliculasPorPreferencias(generosPreferidos: string[]) {
    // Obtener películas que coincidan con los géneros preferidos del usuario
    return this.prisma.pelicula.findMany({
      where: {
        estado: 'ACTIVA',
        OR: generosPreferidos.map(genero => ({
          generos: { has: genero }
        }))
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
          orderBy: {
            inicio: 'asc'
          },
          take: 3
        },
      },
      take: 20
    });
  }
}
