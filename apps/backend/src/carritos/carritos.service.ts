import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginatedResponse } from '../common/dto/pagination.dto';
import * as moment from 'moment-timezone';

@Injectable()
export class CarritosService {
  constructor(private prisma: PrismaService) {}

  async create(createCarritoDto: CreateCarritoDto, userId?: string, vendedorId?: string) {
    const { tipo } = createCarritoDto;
    
    // Establecer expiración según el tipo
    let expiracion: Date;
    if (tipo === 'CLIENTE') {
      expiracion = moment.tz('America/Mazatlan').add(10, 'minutes').toDate(); // 10 min para clientes
    } else {
      expiracion = moment.tz('America/Mazatlan').add(30, 'minutes').toDate(); // 30 min para mostrador
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

  async findAll(query: any) {
    const { page = 1, limit = 10, search = '', tipo, usuarioId, vendedorId } = query;
    const skip = (page - 1) * limit;

    let where: any = {};
    
    if (search) {
      where = {
        OR: [
          { usuario: { nombre: { contains: search, mode: 'insensitive' } } },
          { vendedor: { nombre: { contains: search, mode: 'insensitive' } } },
        ],
      };
    }

    if (tipo) where.tipo = tipo;
    if (usuarioId) where.usuarioId = usuarioId;
    if (vendedorId) where.vendedorId = vendedorId;

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

    return createPaginatedResponse(carritos, total, page, limit);
  }

  async findOne(id: string, userId?: string, vendedorId?: string) {
    const carrito = await this.prisma.carrito.findUnique({
      where: { id },
      include: {
        items: true,
        usuario: true,
        vendedor: true,
      },
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    // Verificar acceso
    if (carrito.usuarioId && carrito.usuarioId !== userId) {
      throw new ForbiddenException('No tienes acceso a este carrito');
    }

    if (carrito.vendedorId && carrito.vendedorId !== vendedorId) {
      throw new ForbiddenException('No tienes acceso a este carrito');
    }

    // Verificar si expiró
    if (new Date() > carrito.expiracion) {
      throw new BadRequestException('El carrito ha expirado');
    }

    return carrito;
  }

  async addItem(id: string, addItemDto: AddItemDto, userId?: string, vendedorId?: string) {
    const carrito = await this.findOne(id, userId, vendedorId);

    const { tipo, referenciaId, cantidad, precioUnitario } = addItemDto;

    // Si es un boleto, verificar disponibilidad
    if (tipo === 'BOLETO') {
      const boletoExistente = await this.prisma.boleto.findFirst({
        where: {
          id: referenciaId,
          estado: { in: ['RESERVADO', 'PAGADO', 'VALIDADO'] },
        },
      });

      if (boletoExistente) {
        throw new BadRequestException('El asiento ya no está disponible');
      }

      // Verificar que la función no esté cancelada
      const funcion = await this.prisma.funcion.findUnique({
        where: { id: boletoExistente?.funcionId || '' },
      });

      if (funcion?.cancelada) {
        throw new BadRequestException('La función está cancelada');
      }
    }

    // Si es dulcería, verificar que esté activa
    if (tipo === 'DULCERIA') {
      const dulceriaItem = await this.prisma.dulceriaItem.findUnique({
        where: { id: referenciaId },
      });

      if (!dulceriaItem || !dulceriaItem.activo) {
        throw new BadRequestException('El item de dulcería no está disponible');
      }
    }

    // Agregar item al carrito
    const item = await this.prisma.carritoItem.create({
      data: {
        carritoId: id,
        tipo,
        referenciaId,
        cantidad,
        precioUnitario,
      },
    });

    // Actualizar expiración del carrito
    const nuevaExpiracion = moment.tz('America/Mazatlan').add(
      carrito.tipo === 'CLIENTE' ? 10 : 30,
      'minutes'
    ).toDate();

    await this.prisma.carrito.update({
      where: { id },
      data: { expiracion: nuevaExpiracion },
    });

    return item;
  }

  async updateItem(id: string, itemId: string, updateItemDto: UpdateItemDto, userId?: string, vendedorId?: string) {
    await this.findOne(id, userId, vendedorId);

    const item = await this.prisma.carritoItem.update({
      where: { id: itemId },
      data: updateItemDto,
    });

    return item;
  }

  async removeItem(id: string, itemId: string, userId?: string, vendedorId?: string) {
    await this.findOne(id, userId, vendedorId);

    await this.prisma.carritoItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item eliminado del carrito' };
  }

  async remove(id: string, userId?: string, vendedorId?: string) {
    await this.findOne(id, userId, vendedorId);

    await this.prisma.carrito.delete({
      where: { id },
    });

    return { message: 'Carrito eliminado exitosamente' };
  }

  async getCarritoByUser(userId: string) {
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

  async getCarritoByVendedor(vendedorId: string) {
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

  public calcularTotal(carrito: any): number {
    return carrito.items.reduce((sum: number, item: any) => {
      return sum + (Number(item.precioUnitario) * item.cantidad);
    }, 0);
  }
}
