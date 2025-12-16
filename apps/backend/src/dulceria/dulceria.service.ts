import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDulceriaItemDto } from './dto/create-dulceria-item.dto';
import { UpdateDulceriaItemDto } from './dto/update-dulceria-item.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class DulceriaService {
  constructor(private prisma: PrismaService) {}

  async create(createDulceriaItemDto: CreateDulceriaItemDto) {
    const dulceriaItem = await this.prisma.dulceriaItem.create({
      data: createDulceriaItemDto,
    });

    return dulceriaItem;
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, search = '', tipo, activo } = query;
    const skip = (page - 1) * limit;

    let where: any = {};
    
    if (search) {
      where = {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { descripcion: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (tipo) where.tipo = tipo;
    if (activo !== undefined) where.activo = activo;

    const [items, total] = await Promise.all([
      this.prisma.dulceriaItem.findMany({
        where,
        include: {
          _count: {
            select: {
              movimientos: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.dulceriaItem.count({ where }),
    ]);

    return createPaginatedResponse(items, total, page, limit);
  }

  async findActive() {
    return this.prisma.dulceriaItem.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findByTipo(tipo: string) {
    return this.prisma.dulceriaItem.findMany({
      where: {
        tipo: tipo as any,
        activo: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const dulceriaItem = await this.prisma.dulceriaItem.findUnique({
      where: { id },
    });

    if (!dulceriaItem) {
      throw new NotFoundException('Item de dulcería no encontrado');
    }

    return dulceriaItem;
  }

  async update(id: string, updateDulceriaItemDto: UpdateDulceriaItemDto) {
    // Verificar si el item existe
    await this.findOne(id);

    const dulceriaItem = await this.prisma.dulceriaItem.update({
      where: { id },
      data: updateDulceriaItemDto,
    });

    return dulceriaItem;
  }

  async remove(id: string) {
    // Verificar si el item existe
    await this.findOne(id);

    // Marcar como inactivo en lugar de eliminar
    const dulceriaItem = await this.prisma.dulceriaItem.update({
      where: { id },
      data: { activo: false },
    });

    return { message: 'Item de dulcería marcado como inactivo exitosamente', dulceriaItem };
  }

  async activar(id: string) {
    // Verificar si el item existe
    await this.findOne(id);

    const dulceriaItem = await this.prisma.dulceriaItem.update({
      where: { id },
      data: { activo: true },
    });

    return { message: 'Item de dulcería activado exitosamente', dulceriaItem };
  }

  async registrarMovimiento(dulceriaItemId: string, delta: number, motivo: string) {
    // Verificar que el item existe
    await this.findOne(dulceriaItemId);

    const movimiento = await this.prisma.inventarioMov.create({
      data: {
        dulceriaItemId,
        delta,
        motivo,
      },
    });

    return movimiento;
  }

  async obtenerInventario() {
    const items = await this.prisma.dulceriaItem.findMany({
      where: { activo: true },
      include: {
        _count: {
          select: {
            movimientos: true,
          },
        },
      },
    });

    // Calcular inventario actual basado en movimientos
    const inventario = await Promise.all(
      items.map(async (item) => {
        const movimientos = await this.prisma.inventarioMov.findMany({
          where: { dulceriaItemId: item.id },
        });

        const stock = movimientos.reduce((sum, mov) => sum + mov.delta, 0);

        return {
          ...item,
          stock,
        };
      })
    );

    return inventario;
  }

  async procesarVenta(ventaDto: any, vendedorId: string) {
    console.log('🍿 SERVICE: Procesando venta de dulcería');
    console.log('📦 Items:', ventaDto.items);
    console.log('👤 Vendedor ID:', vendedorId);

    // Validar que haya items
    if (!ventaDto.items || ventaDto.items.length === 0) {
      throw new BadRequestException('Debe incluir al menos un item para la venta');
    }

    // Obtener información de los productos
    const productosIds = ventaDto.items.map((item: any) => item.dulceriaItemId);
    const productos = await this.prisma.dulceriaItem.findMany({
      where: {
        id: { in: productosIds },
        activo: true,
      },
    });

    // Validar que todos los productos existan
    if (productos.length !== productosIds.length) {
      throw new BadRequestException('Uno o más productos no están disponibles');
    }

    // Crear un mapa de productos para acceso rápido
    const productosMap = new Map(productos.map(p => [p.id, p]));

    // Validar stock disponible para cada producto
    for (const item of ventaDto.items) {
      const producto = productosMap.get(item.dulceriaItemId);
      if (!producto) {
        throw new BadRequestException(`Producto ${item.dulceriaItemId} no encontrado`);
      }
      if (producto.stock < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`
        );
      }
    }

    console.log('✅ Validación de stock completada');

    // Calcular total de la venta
    let total = 0;
    const itemsConPrecio = ventaDto.items.map((item: any) => {
      const producto = productosMap.get(item.dulceriaItemId);
      if (!producto) {
        throw new BadRequestException(`Producto ${item.dulceriaItemId} no encontrado`);
      }
      const subtotal = Number(producto.precio) * item.cantidad;
      total += subtotal;
      return {
        ...item,
        precio: Number(producto.precio),
        subtotal,
      };
    });

    console.log('💰 Total de la venta:', total);

    // Obtener información del usuario para determinar el tipo de pedido
    const usuario = await this.prisma.user.findUnique({
      where: { id: vendedorId },
      select: { rol: true, nombre: true, email: true }
    });

    console.log('👤 Usuario que realiza la compra:', {
      id: vendedorId,
      nombre: usuario?.nombre,
      email: usuario?.email,
      rol: usuario?.rol
    });

    // Determinar el tipo de pedido según el rol del usuario
    const tipoPedido = usuario?.rol === 'VENDEDOR' ? 'MOSTRADOR' : 'WEB';
    
    console.log('🏷️ Tipo de pedido determinado:', tipoPedido);
    
    // Para compras WEB (clientes), NO asignar vendedorId
    // Para compras MOSTRADOR (vendedores), SÍ asignar vendedorId
    const pedido = await this.prisma.pedido.create({
      data: {
        usuarioId: vendedorId, // El usuario que compra
        vendedorId: tipoPedido === 'MOSTRADOR' ? vendedorId : null, // Solo para mostrador
        total: total,
        tipo: tipoPedido, // WEB o MOSTRADOR según el rol
        estado: 'COMPLETADO',
        metodoPago: tipoPedido === 'WEB' ? 'TARJETA' : 'EFECTIVO',
      },
    });

    console.log(`✅ Pedido ${tipoPedido} creado:`, pedido.id);

    // Crear los items del pedido
    const pedidoItems = await Promise.all(
      itemsConPrecio.map((item: any) => {
        const producto = productosMap.get(item.dulceriaItemId);
        return this.prisma.pedidoItem.create({
          data: {
            pedido: {
              connect: { id: pedido.id }
            },
            tipo: 'DULCERIA',
            referenciaId: item.dulceriaItemId,
            descripcion: producto?.nombre || 'Producto de dulcería',
            cantidad: item.cantidad,
            precio: item.precio,
            precioUnitario: item.precio,
            subtotal: item.subtotal,
          },
        });
      })
    );

    console.log(`✅ Creados ${pedidoItems.length} items del pedido`);

    // Registrar movimientos de inventario (salida) y actualizar stock
    await Promise.all(
      itemsConPrecio.map(async (item: any) => {
        // Registrar movimiento
        await this.registrarMovimiento(
          item.dulceriaItemId,
          -item.cantidad, // Negativo porque es una salida
          `Venta - Pedido ${pedido.id}`
        );
        
        // Actualizar stock directamente en el item
        const producto = productosMap.get(item.dulceriaItemId);
        if (producto) {
          const nuevoStock = Math.max(0, producto.stock - item.cantidad);
          await this.prisma.dulceriaItem.update({
            where: { id: item.dulceriaItemId },
            data: { stock: nuevoStock }
          });
          console.log(`📦 Stock actualizado para ${producto.nombre}: ${producto.stock} → ${nuevoStock}`);
        }
      })
    );

    console.log('✅ Movimientos de inventario registrados y stock actualizado');

    // Retornar el pedido completo con sus items
    const pedidoCompleto = await this.prisma.pedido.findUnique({
      where: { id: pedido.id },
      include: {
        items: true,
        vendedor: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });

    // Agregar información de los productos a los items
    const pedidoConProductos = {
      ...pedidoCompleto,
      items: pedidoCompleto.items.map(item => {
        const producto = productosMap.get(item.referenciaId);
        return {
          ...item,
          producto: producto ? {
            id: producto.id,
            nombre: producto.nombre,
            tipo: producto.tipo,
          } : null,
        };
      }),
    };

    console.log('🎉 Venta procesada exitosamente');

    return {
      success: true,
      pedido: pedidoConProductos,
      message: 'Venta de dulcería procesada exitosamente',
    };
  }
}
