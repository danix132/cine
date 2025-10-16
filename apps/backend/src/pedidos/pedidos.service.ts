import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto) {
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
            descripcion: (item as any).descripcion || '',
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

  async findAll(query: any) {
    const { page = 1, limit = 10, usuarioId, vendedorId, tipo, desde, hasta } = query;
    const skip = (page - 1) * limit;

    let where: any = {};
    
    if (usuarioId) where.usuarioId = usuarioId;
    if (vendedorId) where.vendedorId = vendedorId;
    if (tipo) where.tipo = tipo;
    if (desde) where.createdAt = { gte: new Date(desde) };
    if (hasta) where.createdAt = { ...where.createdAt, lte: new Date(hasta) };

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

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        usuario: { select: { nombre: true, email: true } },
        vendedor: { select: { nombre: true, email: true } },
        items: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    // Enriquecer los items con información de dulcería si es necesario
    const itemsEnriquecidos = await Promise.all(
      pedido.items.map(async (item) => {
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
      })
    );

    return {
      ...pedido,
      items: itemsEnriquecidos,
    };
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    await this.findOne(id);

    const updateData: any = {};
    if (updatePedidoDto.usuarioId !== undefined) updateData.usuarioId = updatePedidoDto.usuarioId;
    if (updatePedidoDto.vendedorId !== undefined) updateData.vendedorId = updatePedidoDto.vendedorId;
    if (updatePedidoDto.total !== undefined) updateData.total = updatePedidoDto.total;
    if (updatePedidoDto.tipo !== undefined) updateData.tipo = updatePedidoDto.tipo;

    return this.prisma.pedido.update({
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
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.pedido.delete({
      where: { id },
    });
  }

  async findMyOrders(usuarioId: string) {
    return this.prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        items: {
          include: {
            pedido: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
