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
    if (updatePedidoDto.ticketData !== undefined) updateData.ticketData = updatePedidoDto.ticketData;
    if (updatePedidoDto.estado !== undefined) updateData.estado = updatePedidoDto.estado;
    if (updatePedidoDto.entregado !== undefined) updateData.entregado = updatePedidoDto.entregado;
    if (updatePedidoDto.fechaEntrega !== undefined) updateData.fechaEntrega = updatePedidoDto.fechaEntrega;

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

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.pedido.delete({
      where: { id },
    });
  }

  async marcarComoEntregado(id: string, vendedorId: string) {
    // Buscar el pedido
    const pedido = await this.findOne(id);

    // Verificar que el pedido tenga items de dulcería
    const tieneDulceria = pedido.items.some(item => item.tipo === 'DULCERIA');
    if (!tieneDulceria) {
      throw new NotFoundException('Este pedido no contiene items de dulcería');
    }

    // Verificar que el pedido sea de tipo WEB
    if (pedido.tipo !== 'WEB') {
      throw new NotFoundException('Solo se pueden entregar pedidos de tipo WEB');
    }

    // Verificar que no esté ya entregado
    if (pedido.entregado) {
      throw new NotFoundException('Este pedido ya fue entregado anteriormente');
    }

    // Verificar que el pedido esté completado (pagado)
    if (pedido.estado !== 'COMPLETADO') {
      throw new NotFoundException('El pedido debe estar pagado para ser entregado');
    }

    // Marcar como entregado
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

  async findMyOrders(usuarioId: string) {
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
      const primerPedido = resultado[0] as any;
      console.log('   Primer pedido tiene ticketData:', !!primerPedido?.ticketData);
      console.log('   Tamaño ticketData:', primerPedido?.ticketData?.length || 0);
    }
    
    return resultado;
  }
}
