import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ReportesService {
  constructor(private readonly prisma: PrismaService) {}

  async reporteVentas(desde: Date, hasta: Date) {
    console.log('🔍 REPORTES: Generando reporte de compras de clientes');
    console.log('📅 REPORTES: Período solicitado:', { desde, hasta });
    console.log('📅 REPORTES: Fecha actual del sistema:', new Date());
    
    const ventas = await this.prisma.pedido.findMany({
      where: {
        createdAt: {
          gte: desde,
          lte: hasta,
        },
      },
      include: {
        usuario: { select: { nombre: true, email: true } },
        vendedor: { select: { nombre: true, email: true } },
        items: {
          select: {
            tipo: true,
            cantidad: true,
            precio: true,
            subtotal: true,
            descripcion: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalVentas = ventas.reduce((sum, pedido) => sum + Number(pedido.total), 0);
    const cantidadPedidos = ventas.length;

    console.log(`📊 REPORTES: Encontradas ${cantidadPedidos} compras de clientes en el período`);
    console.log('💰 REPORTES: Total de ventas:', totalVentas);
    
    if (ventas.length > 0) {
      console.log('🔍 REPORTES: Primeras compras encontradas:', 
        ventas.slice(0, 3).map(v => ({
          id: v.id,
          createdAt: v.createdAt,
          total: v.total,
          cliente: v.usuario?.nombre || 'Sin nombre',
          email: v.usuario?.email || 'Sin email',
          itemsCount: v.items.length
        }))
      );
    }

    return {
      periodo: { desde, hasta },
      totalVentas,
      cantidadPedidos,
      ventas,
    };
  }

  async reporteOcupacion(desde: Date, hasta: Date) {
    console.log('🏛️ REPORTES: Generando reporte de Ocupación de Salas');
    console.log('📅 REPORTES: Período:', { desde, hasta });
    
    const funciones = await this.prisma.funcion.findMany({
      where: {
        inicio: {
          gte: desde,
          lte: hasta,
        },
        cancelada: false,
      },
      include: {
        pelicula: { select: { titulo: true } },
        sala: { 
          select: { 
            nombre: true, 
            filas: true, 
            asientosPorFila: true,
            asientos: {
              select: {
                id: true,
                estado: true
              }
            }
          } 
        },
        boletos: {
          where: {
            estado: {
              not: 'CANCELADO' // Incluir todos los boletos excepto cancelados
            }
          },
          select: { 
            id: true,
            estado: true // Para debug
          }
        }
      },
    });

    console.log(`🎬 REPORTES: Funciones encontradas: ${funciones.length}`);

    // Debug: Mostrar primeras funciones con boletos
    if (funciones.length > 0) {
      const primeraFuncion = funciones[0];
      console.log('🔍 DEBUG: Primera función:', {
        id: primeraFuncion.id,
        pelicula: primeraFuncion.pelicula.titulo,
        sala: primeraFuncion.sala.nombre,
        totalBoletos: primeraFuncion.boletos.length,
        estadosBoletos: primeraFuncion.boletos.map((b: any) => b.estado)
      });
      
      // Verificar si hay boletos en TODAS las funciones
      const funcionesConBoletos = funciones.filter((f: any) => f.boletos.length > 0);
      console.log(`📊 Funciones con boletos: ${funcionesConBoletos.length}/${funciones.length}`);
    }

    const ocupacionPorFuncion = funciones.map((funcion: any) => {
      // Calcular total de asientos disponibles (excluir dañados)
      const asientosDanados = funcion.sala.asientos.filter((a: any) => a.estado === 'DANADO').length;
      const totalAsientosDisponibles = (funcion.sala.filas * funcion.sala.asientosPorFila) - asientosDanados;
      
      // Contar solo boletos activos (ya filtrados en la query)
      const asientosOcupados = funcion.boletos.length;
      
      // Calcular porcentaje sobre asientos disponibles
      const porcentajeOcupacion = totalAsientosDisponibles > 0 
        ? (asientosOcupados / totalAsientosDisponibles) * 100 
        : 0;

      console.log(`🎫 ${funcion.pelicula.titulo} (${funcion.sala.nombre}): ${asientosOcupados}/${totalAsientosDisponibles} = ${porcentajeOcupacion.toFixed(2)}% | Boletos encontrados: ${funcion.boletos.length}`);

      return {
        funcionId: funcion.id,
        pelicula: funcion.pelicula.titulo,
        sala: funcion.sala.nombre,
        inicio: funcion.inicio,
        totalAsientos: totalAsientosDisponibles,
        asientosOcupados,
        porcentajeOcupacion: Math.round(porcentajeOcupacion * 100) / 100,
      };
    });

    const promedioOcupacion = ocupacionPorFuncion.length > 0
      ? ocupacionPorFuncion.reduce((sum, f) => sum + f.porcentajeOcupacion, 0) / ocupacionPorFuncion.length
      : 0;

    console.log(`📊 REPORTES: Ocupación promedio: ${promedioOcupacion.toFixed(2)}%`);

    return {
      periodo: { desde, hasta },
      totalFunciones: funciones.length,
      ocupacionPorFuncion,
      promedioOcupacion: Math.round(promedioOcupacion * 100) / 100,
    };
  }

  async reporteTopPeliculas(desde: Date, hasta: Date, limit = 10) {
    const topPeliculas = await this.prisma.pelicula.findMany({
      include: {
        funciones: {
          where: {
            inicio: {
              gte: desde,
              lte: hasta,
            },
            cancelada: false,
          },
          include: {
            _count: { select: { boletos: true } },
          },
        },
      },
    });

    const peliculasConVentas = topPeliculas
      .map(pelicula => {
        const totalBoletos = pelicula.funciones.reduce(
          (sum, funcion) => sum + funcion._count.boletos,
          0
        );
        const totalFunciones = pelicula.funciones.length;

        return {
          id: pelicula.id,
          titulo: pelicula.titulo,
          totalBoletos,
          totalFunciones,
          promedioBoletosPorFuncion: totalFunciones > 0 ? totalBoletos / totalFunciones : 0,
        };
      })
      .filter(pelicula => pelicula.totalBoletos > 0)
      .sort((a, b) => b.totalBoletos - a.totalBoletos)
      .slice(0, limit);

    return {
      periodo: { desde, hasta },
      topPeliculas: peliculasConVentas,
    };
  }

  async reporteVentasPorVendedor(desde: Date, hasta: Date) {
    console.log('👥 REPORTES: Generando reporte de Top Clientes Frecuentes');
    console.log('📅 REPORTES: Período:', { desde, hasta });
    
    // Cambiar agrupación de vendedorId a usuarioId para mostrar clientes
    const ventasPorCliente = await this.prisma.pedido.groupBy({
      by: ['usuarioId'],
      where: {
        createdAt: {
          gte: desde,
          lte: hasta,
        },
        usuarioId: { not: null },
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
    });

    console.log(`📊 REPORTES: Encontrados ${ventasPorCliente.length} usuarios con compras`);

    const clientesConVentas = await Promise.all(
      ventasPorCliente.map(async (venta) => {
        const cliente = await this.prisma.user.findUnique({
          where: { id: venta.usuarioId },
          select: { 
            nombre: true, 
            email: true,
            rol: true // 🆕 Obtener el rol
          },
        });

        return {
          vendedorId: venta.usuarioId, // Mantener el nombre del campo para compatibilidad
          nombre: cliente?.nombre || 'Cliente sin nombre',
          email: cliente?.email || 'Sin email',
          rol: cliente?.rol || 'CLIENTE', // 🆕 Agregar rol
          totalVentas: Number(venta._sum.total),
          cantidadPedidos: venta._count.id,
        };
      })
    );

    // 🆕 Filtrar solo usuarios con rol CLIENTE (excluir VENDEDOR y ADMIN)
    const soloClientes = clientesConVentas.filter(cliente => cliente.rol === 'CLIENTE');
    
    console.log(`� REPORTES: Total usuarios: ${clientesConVentas.length}, Solo CLIENTES: ${soloClientes.length}`);
    console.log('💰 REPORTES: Top 3 clientes:', soloClientes.slice(0, 3));

    return {
      periodo: { desde, hasta },
      ventasPorVendedor: soloClientes.sort((a, b) => b.totalVentas - a.totalVentas),
    };
  }

  async reporteDesglosePorTipo(vendedorId: string, desde: Date, hasta: Date) {
    console.log('📊 REPORTES: Generando desglose por tipo para vendedor:', vendedorId);
    console.log('📅 REPORTES: Período:', { desde, hasta });

    // Obtener todos los items de pedidos del vendedor en el período
    const items = await this.prisma.pedidoItem.findMany({
      where: {
        pedido: {
          vendedorId: vendedorId,
          createdAt: {
            gte: desde,
            lte: hasta,
          },
        },
      },
      select: {
        tipo: true,
        cantidad: true,
        subtotal: true,
      },
    });

    console.log(`📦 REPORTES: Total de items encontrados: ${items.length}`);
    if (items.length > 0) {
      console.log('📦 REPORTES: Primeros 3 items:', items.slice(0, 3));
    }

    // Calcular totales por tipo
    let boletosCantidad = 0;
    let boletosTotal = 0;
    let dulceriaCantidad = 0;
    let dulceriaTotal = 0;

    items.forEach(item => {
      const subtotal = Number(item.subtotal);
      
      if (item.tipo === 'BOLETO') {
        boletosCantidad += item.cantidad;
        boletosTotal += subtotal;
        console.log(`🎫 Item BOLETO: cantidad=${item.cantidad}, subtotal=${subtotal}`);
      } else if (item.tipo === 'DULCERIA') {
        dulceriaCantidad += item.cantidad;
        dulceriaTotal += subtotal;
        console.log(`🍬 Item DULCERIA: cantidad=${item.cantidad}, subtotal=${subtotal}`);
      }
    });

    console.log('📊 REPORTES: Desglose calculado:', {
      boletos: { cantidad: boletosCantidad, total: boletosTotal },
      dulceria: { cantidad: dulceriaCantidad, total: dulceriaTotal }
    });

    return {
      periodo: { desde, hasta },
      vendedorId,
      desglose: {
        boletos: {
          cantidad: boletosCantidad,
          total: boletosTotal,
        },
        dulceria: {
          cantidad: dulceriaCantidad,
          total: dulceriaTotal,
        },
      },
    };
  }

  async reporteMisVentasVendedor(vendedorId: string, desde: Date, hasta: Date) {
    console.log('👤 REPORTES: Generando reporte de ventas para vendedor:', vendedorId);
    console.log('📅 REPORTES: Período:', { desde, hasta });

    // Primero verificar si hay pedidos del vendedor (para debugging)
    const todosPedidos = await this.prisma.pedido.findMany({
      where: {
        vendedorId: vendedorId,
        createdAt: {
          gte: desde,
          lte: hasta,
        },
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
        tipo: true,
      },
    });

    console.log(`🔍 REPORTES: Pedidos encontrados para vendedor ${vendedorId}:`, todosPedidos.length);
    if (todosPedidos.length > 0) {
      console.log('📦 REPORTES: Primeros 3 pedidos:', todosPedidos.slice(0, 3));
    }

    // Obtener ventas del vendedor específico
    const ventasVendedor = await this.prisma.pedido.groupBy({
      by: ['vendedorId'],
      where: {
        vendedorId: vendedorId,
        createdAt: {
          gte: desde,
          lte: hasta,
        },
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
    });

    console.log(`📊 REPORTES: Ventas del vendedor agrupadas:`, ventasVendedor);

    // Si el vendedor tiene ventas
    if (ventasVendedor.length > 0) {
      const venta = ventasVendedor[0];
      const vendedor = await this.prisma.user.findUnique({
        where: { id: vendedorId },
        select: { nombre: true, email: true },
      });

      const resultado = {
        vendedorId: vendedorId,
        nombre: vendedor?.nombre || 'Vendedor sin nombre',
        email: vendedor?.email || 'Sin email',
        totalVentas: Number(venta._sum.total || 0),
        cantidadPedidos: venta._count.id,
      };

      console.log('✅ REPORTES: Datos del vendedor:', resultado);

      return {
        periodo: { desde, hasta },
        ventasPorVendedor: [resultado],
      };
    }

    // Si no tiene ventas, devolver estructura con valores en 0
    const vendedor = await this.prisma.user.findUnique({
      where: { id: vendedorId },
      select: { nombre: true, email: true },
    });

    const resultado = {
      vendedorId: vendedorId,
      nombre: vendedor?.nombre || 'Vendedor sin nombre',
      email: vendedor?.email || 'Sin email',
      totalVentas: 0,
      cantidadPedidos: 0,
    };

    console.log('⚠️ REPORTES: Vendedor sin ventas:', resultado);

    return {
      periodo: { desde, hasta },
      ventasPorVendedor: [resultado],
    };
  }

  async reporteVentasDulceria(desde: Date, hasta: Date) {
    console.log('🍿 REPORTES: Generando reporte de ventas de dulcería');
    console.log('📅 REPORTES: Período:', { desde, hasta });

    // Obtener todos los items de pedidos de dulcería en el período
    const itemsDulceria = await this.prisma.pedidoItem.findMany({
      where: {
        tipo: 'DULCERIA',
        pedido: {
          createdAt: {
            gte: desde,
            lte: hasta,
          },
        },
      },
      include: {
        pedido: {
          select: {
            createdAt: true,
            total: true,
          },
        },
      },
    });

    console.log(`📊 REPORTES: Encontrados ${itemsDulceria.length} items de dulcería`);

    // Obtener información de los productos de dulcería
    const productoIds = [...new Set(itemsDulceria.map(item => item.referenciaId))];
    const productos = await this.prisma.dulceriaItem.findMany({
      where: {
        id: { in: productoIds },
      },
    });

    // Crear un mapa de productos para acceso rápido
    const productosMap = new Map(productos.map(p => [p.id, p]));

    // Calcular ventas por producto
    const ventasPorProductoMap = new Map<string, {
      productoId: string;
      nombre: string;
      tipo: string;
      cantidadVendida: number;
      totalVentas: number;
    }>();

    itemsDulceria.forEach(item => {
      const producto = productosMap.get(item.referenciaId);
      if (!producto) return;

      const key = item.referenciaId;
      const existing = ventasPorProductoMap.get(key);
      const subtotal = Number(item.precioUnitario) * item.cantidad;

      if (existing) {
        existing.cantidadVendida += item.cantidad;
        existing.totalVentas += subtotal;
      } else {
        ventasPorProductoMap.set(key, {
          productoId: producto.id,
          nombre: producto.nombre,
          tipo: producto.tipo,
          cantidadVendida: item.cantidad,
          totalVentas: subtotal,
        });
      }
    });

    const ventasPorProducto = Array.from(ventasPorProductoMap.values())
      .sort((a, b) => b.totalVentas - a.totalVentas);

    // Calcular ventas por día
    const ventasPorDiaMap = new Map<string, {
      fecha: string;
      cantidadProductos: number;
      totalVentas: number;
    }>();

    itemsDulceria.forEach(item => {
      const fecha = item.pedido.createdAt.toISOString().split('T')[0];
      const existing = ventasPorDiaMap.get(fecha);
      const subtotal = Number(item.precioUnitario) * item.cantidad;

      if (existing) {
        existing.cantidadProductos += item.cantidad;
        existing.totalVentas += subtotal;
      } else {
        ventasPorDiaMap.set(fecha, {
          fecha,
          cantidadProductos: item.cantidad,
          totalVentas: subtotal,
        });
      }
    });

    const ventasPorDia = Array.from(ventasPorDiaMap.values())
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Calcular totales
    const totalVentas = ventasPorProducto.reduce((sum, p) => sum + p.totalVentas, 0);
    const totalProductosVendidos = ventasPorProducto.reduce((sum, p) => sum + p.cantidadVendida, 0);

    console.log('💰 REPORTES: Total ventas dulcería:', totalVentas);
    console.log('📦 REPORTES: Total productos vendidos:', totalProductosVendidos);

    return {
      periodo: { desde, hasta },
      totalVentas,
      totalProductosVendidos,
      ventasPorProducto,
      ventasPorDia,
    };
  }

  // ============ REPORTES AVANZADOS ============

  /**
   * Reporte de Ventas por Canal (Online/Taquilla)
   */
  async reporteVentasPorCanal(desde: Date, hasta: Date) {
    console.log('📊 REPORTES: Generando reporte de ventas por canal');

    const pedidos = await this.prisma.pedido.findMany({
      where: {
        createdAt: { gte: desde, lte: hasta },
      },
      select: {
        total: true,
        metodoPago: true,
        vendedorId: true,
      },
    });

    const ventasPorCanal = {
      online: { cantidad: 0, total: 0 },
      taquilla: { cantidad: 0, total: 0 },
    };

    const ventasPorMetodoPago: Record<string, { cantidad: number; total: number }> = {};

    pedidos.forEach(pedido => {
      const canal = pedido.vendedorId ? 'taquilla' : 'online';
      ventasPorCanal[canal].cantidad++;
      ventasPorCanal[canal].total += Number(pedido.total);

      if (!ventasPorMetodoPago[pedido.metodoPago]) {
        ventasPorMetodoPago[pedido.metodoPago] = { cantidad: 0, total: 0 };
      }
      ventasPorMetodoPago[pedido.metodoPago].cantidad++;
      ventasPorMetodoPago[pedido.metodoPago].total += Number(pedido.total);
    });

    return {
      periodo: { desde, hasta },
      ventasPorCanal,
      ventasPorMetodoPago: Object.entries(ventasPorMetodoPago).map(([metodo, data]) => ({
        metodo,
        ...data,
      })),
      totalPedidos: pedidos.length,
      totalVentas: pedidos.reduce((sum, p) => sum + Number(p.total), 0),
    };
  }

  /**
   * Reporte de Descuentos y Promociones
   */
  async reporteDescuentosPromociones(desde: Date, hasta: Date) {
    console.log('🎫 REPORTES: Generando reporte de descuentos y promociones');

    // Por ahora, análisis básico de pedidos con descuento implícito
    const pedidos = await this.prisma.pedido.findMany({
      where: {
        createdAt: { gte: desde, lte: hasta },
      },
      include: {
        items: true,
      },
    });

    const pedidosConDescuento = pedidos.filter(p => {
      const subtotal = p.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
      return Number(p.total) < subtotal;
    });

    const totalDescuentos = pedidosConDescuento.reduce((sum, p) => {
      const subtotal = p.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
      return sum + (subtotal - Number(p.total));
    }, 0);

    return {
      periodo: { desde, hasta },
      totalPedidos: pedidos.length,
      pedidosConDescuento: pedidosConDescuento.length,
      porcentajeDescuento: pedidos.length > 0 ? (pedidosConDescuento.length / pedidos.length) * 100 : 0,
      totalDescuentos,
      promedioDescuento: pedidosConDescuento.length > 0 ? totalDescuentos / pedidosConDescuento.length : 0,
    };
  }

  /**
   * Reporte de Horarios Pico (Demanda por Franja)
   */
  async reporteHorariosPico(desde: Date, hasta: Date) {
    console.log('⏰ REPORTES: Generando reporte de horarios pico');

    const funciones = await this.prisma.funcion.findMany({
      where: {
        inicio: { gte: desde, lte: hasta },
        cancelada: false,
      },
      include: {
        _count: { select: { boletos: true } },
        sala: { select: { filas: true, asientosPorFila: true } },
      },
    });

    const franjasPorHora: Record<number, { funciones: number; totalBoletos: number; capacidadTotal: number }> = {};

    funciones.forEach(funcion => {
      const hora = funcion.inicio.getHours();
      if (!franjasPorHora[hora]) {
        franjasPorHora[hora] = { funciones: 0, totalBoletos: 0, capacidadTotal: 0 };
      }
      franjasPorHora[hora].funciones++;
      franjasPorHora[hora].totalBoletos += funcion._count.boletos;
      franjasPorHora[hora].capacidadTotal += funcion.sala.filas * funcion.sala.asientosPorFila;
    });

    const horariosPico = Object.entries(franjasPorHora)
      .map(([hora, data]) => ({
        hora: parseInt(hora),
        ...data,
        ocupacionPromedio: data.capacidadTotal > 0 ? (data.totalBoletos / data.capacidadTotal) * 100 : 0,
      }))
      .sort((a, b) => b.ocupacionPromedio - a.ocupacionPromedio);

    return {
      periodo: { desde, hasta },
      horariosPico,
      horaMasPopular: horariosPico[0]?.hora || null,
    };
  }

  /**
   * Reporte de Ingresos por Película con Detalle por Función
   */
  async reporteIngresosPorPelicula(desde: Date, hasta: Date) {
    console.log('🎬 REPORTES: Generando reporte de ingresos por película');

    const funciones = await this.prisma.funcion.findMany({
      where: {
        inicio: { gte: desde, lte: hasta },
        cancelada: false,
      },
      include: {
        pelicula: { select: { id: true, titulo: true, generos: true } },
        sala: { select: { nombre: true } },
        _count: { select: { boletos: true } },
      },
    });

    // Obtener información de boletos con precios
    const boletos = await this.prisma.boleto.findMany({
      where: {
        funcion: {
          inicio: { gte: desde, lte: hasta },
          cancelada: false,
        },
      },
      include: {
        funcion: { select: { peliculaId: true, precio: true } },
      },
    });

    const peliculasMap = new Map<string, any>();

    funciones.forEach(funcion => {
      const peliculaId = funcion.peliculaId;
      const boletosFuncion = boletos.filter(b => b.funcionId === funcion.id);
      const ingresoFuncion = boletosFuncion.length * Number(funcion.precio);

      if (!peliculasMap.has(peliculaId)) {
        peliculasMap.set(peliculaId, {
          peliculaId,
          titulo: funcion.pelicula.titulo,
          generos: funcion.pelicula.generos,
          totalFunciones: 0,
          totalBoletos: 0,
          ingresoTotal: 0,
          funciones: [],
        });
      }

      const pelicula = peliculasMap.get(peliculaId);
      pelicula.totalFunciones++;
      pelicula.totalBoletos += funcion._count.boletos;
      pelicula.ingresoTotal += ingresoFuncion;
      pelicula.funciones.push({
        funcionId: funcion.id,
        sala: funcion.sala.nombre,
        inicio: funcion.inicio,
        boletos: funcion._count.boletos,
        ingreso: ingresoFuncion,
      });
    });

    const peliculas = Array.from(peliculasMap.values())
      .map(p => ({
        ...p,
        ingresoPromedioPorFuncion: p.totalFunciones > 0 ? p.ingresoTotal / p.totalFunciones : 0,
        precioPromedioBoleto: p.totalBoletos > 0 ? p.ingresoTotal / p.totalBoletos : 0,
      }))
      .sort((a, b) => b.ingresoTotal - a.ingresoTotal);

    return {
      periodo: { desde, hasta },
      peliculas,
      totalIngresos: peliculas.reduce((sum, p) => sum + p.ingresoTotal, 0),
    };
  }

  /**
   * Dashboard KPIs Principal
   */
  async reporteDashboardKPIs(desde: Date, hasta: Date) {
    console.log('📈 REPORTES: Generando Dashboard KPIs');

    // Ventas totales
    const pedidos = await this.prisma.pedido.findMany({
      where: { createdAt: { gte: desde, lte: hasta } },
      include: { items: true },
    });

    const totalIngresos = pedidos.reduce((sum, p) => sum + Number(p.total), 0);
    const totalPedidos = pedidos.length;

    // Boletos vendidos
    const boletos = await this.prisma.boleto.findMany({
      where: {
        funcion: {
          inicio: { gte: desde, lte: hasta },
        },
      },
    });
    const totalBoletos = boletos.length;

    // Ocupación promedio
    const funciones = await this.prisma.funcion.findMany({
      where: {
        inicio: { gte: desde, lte: hasta },
        cancelada: false,
      },
      include: {
        _count: { select: { boletos: true } },
        sala: { select: { filas: true, asientosPorFila: true } },
      },
    });

    const ocupacionTotal = funciones.reduce((sum, f) => {
      const capacidad = f.sala.filas * f.sala.asientosPorFila;
      return sum + (f._count.boletos / capacidad) * 100;
    }, 0);

    const ocupacionPromedio = funciones.length > 0 ? ocupacionTotal / funciones.length : 0;

    // Ventas dulcería
    const ventasDulceria = pedidos.reduce((sum, p) => {
      const dulceriaItems = p.items.filter(i => i.tipo === 'DULCERIA');
      return sum + dulceriaItems.reduce((s, i) => s + Number(i.subtotal), 0);
    }, 0);

    // Clientes únicos
    const clientesUnicos = new Set(pedidos.map(p => p.usuarioId)).size;

    return {
      periodo: { desde, hasta },
      kpis: {
        totalIngresos,
        totalPedidos,
        totalBoletos,
        ticketPromedio: totalPedidos > 0 ? totalIngresos / totalPedidos : 0,
        precioPromedioBoleto: totalBoletos > 0 ? (totalIngresos - ventasDulceria) / totalBoletos : 0,
        ocupacionPromedio: Math.round(ocupacionPromedio * 10) / 10,
        ventasDulceria,
        clientesUnicos,
        funcionesTotales: funciones.length,
      },
    };
  }

  /**
   * Reporte de Serie Temporal (Ventas por Día)
   */
  async reporteSerieTemporal(desde: Date, hasta: Date) {
    console.log('📅 REPORTES: Generando serie temporal de ventas');

    const pedidos = await this.prisma.pedido.findMany({
      where: { createdAt: { gte: desde, lte: hasta } },
      select: { 
        createdAt: true, 
        total: true,
        items: {
          select: {
            tipo: true,
            subtotal: true
          }
        }
      },
    });

    const ventasPorDia = new Map<string, { 
      fecha: string; 
      ingresos: number; 
      pedidos: number;
      ingresosBoletos: number;
      ingresosDulceria: number;
      cantidadBoletos: number;
      cantidadDulceria: number;
    }>();

    pedidos.forEach(pedido => {
      const fecha = pedido.createdAt.toISOString().split('T')[0];
      if (!ventasPorDia.has(fecha)) {
        ventasPorDia.set(fecha, { 
          fecha, 
          ingresos: 0, 
          pedidos: 0,
          ingresosBoletos: 0,
          ingresosDulceria: 0,
          cantidadBoletos: 0,
          cantidadDulceria: 0
        });
      }
      const dia = ventasPorDia.get(fecha)!;
      dia.ingresos += Number(pedido.total);
      dia.pedidos++;

      // Separar ingresos por tipo de item
      pedido.items.forEach(item => {
        const subtotal = Number(item.subtotal);
        if (item.tipo === 'BOLETO') {
          dia.ingresosBoletos += subtotal;
          dia.cantidadBoletos++;
        } else if (item.tipo === 'DULCERIA') {
          dia.ingresosDulceria += subtotal;
          dia.cantidadDulceria++;
        }
      });
    });

    const serie = Array.from(ventasPorDia.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));

    return {
      periodo: { desde, hasta },
      serie,
    };
  }
}
