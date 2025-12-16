import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';

@Injectable()
export class BoletosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBoletoDto: CreateBoletoDto) {
    console.log('🎫 BACKEND: Iniciando creación de boleto con DTO:', createBoletoDto);
    
    // Validar que funcionId y asientoId existan
    const funcionExists = await this.prisma.funcion.findUnique({
      where: { id: createBoletoDto.funcionId }
    });
    
    if (!funcionExists) {
      console.error('❌ BACKEND: Función no encontrada:', createBoletoDto.funcionId);
      throw new NotFoundException('Función no encontrada');
    }
    
    const asientoExists = await this.prisma.asiento.findUnique({
      where: { id: createBoletoDto.asientoId }
    });
    
    if (!asientoExists) {
      console.error('❌ BACKEND: Asiento no encontrado:', createBoletoDto.asientoId);
      throw new NotFoundException('Asiento no encontrado');
    }
    
    // Verificar que el usuario existe si se proporciona usuarioId
    if (createBoletoDto.usuarioId) {
      const usuarioExists = await this.prisma.user.findUnique({
        where: { id: createBoletoDto.usuarioId }
      });
      
      if (!usuarioExists) {
        console.error('❌ BACKEND: Usuario no encontrado:', createBoletoDto.usuarioId);
        throw new NotFoundException('Usuario no encontrado');
      }
      
      console.log('✅ BACKEND: Usuario validado:', usuarioExists.email);
    }
    
    // Verificar que el asiento no esté ya ocupado para esta función
    const boletoExistente = await this.prisma.boleto.findFirst({
      where: {
        funcionId: createBoletoDto.funcionId,
        asientoId: createBoletoDto.asientoId,
        estado: { not: 'CANCELADO' }
      }
    });
    
    if (boletoExistente) {
      console.error('❌ BACKEND: Asiento ya ocupado para esta función');
      throw new Error('El asiento ya está ocupado para esta función');
    }

    // Generar código QR único
    const codigoQR = `BOLETO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('🔧 BACKEND: Creando boleto con datos:', {
      funcionId: createBoletoDto.funcionId,
      asientoId: createBoletoDto.asientoId,
      usuarioId: createBoletoDto.usuarioId,
      estado: createBoletoDto.estado || 'RESERVADO',
      codigoQR
    });
    
    try {
      const boleto = await this.prisma.boleto.create({
        data: {
          funcionId: createBoletoDto.funcionId,
          asientoId: createBoletoDto.asientoId,
          usuarioId: createBoletoDto.usuarioId,
          estado: (createBoletoDto.estado as any) || 'RESERVADO',
          codigoQR,
        },
        include: {
          funcion: {
            include: {
              pelicula: { select: { titulo: true, posterUrl: true } },
              sala: { select: { nombre: true } },
            },
          },
          asiento: true,
          usuario: { select: { nombre: true, email: true } },
        },
      });
      
      console.log('✅ BACKEND: Boleto creado exitosamente:', boleto.id);
      
      // Si el boleto está PAGADO (venta en efectivo), crear un pedido para que aparezca en reportes
      if (createBoletoDto.estado === 'PAGADO' && createBoletoDto.vendedorId) {
        console.log('💰 BACKEND: Creando pedido para venta en efectivo');
        console.log('👤 BACKEND: VendedorId para pedido:', createBoletoDto.vendedorId);
        
        try {
          const precioBoleto = createBoletoDto.precio || Number(boleto.funcion.precio);
          
          console.log('📝 BACKEND: Creando pedido con datos:', {
            usuarioId: createBoletoDto.usuarioId,
            vendedorId: createBoletoDto.vendedorId,
            total: precioBoleto,
            tipo: 'MOSTRADOR',
            estado: 'COMPLETADO',
            metodoPago: 'EFECTIVO',
            fecha: new Date(),
            pelicula: boleto.funcion.pelicula.titulo
          });
          
          const pedido = await this.prisma.pedido.create({
            data: {
              usuarioId: createBoletoDto.usuarioId,
              vendedorId: createBoletoDto.vendedorId,
              total: precioBoleto,
              tipo: 'MOSTRADOR',
              estado: 'COMPLETADO',
              metodoPago: 'EFECTIVO',
              // Crear item del pedido
              items: {
                create: {
                  tipo: 'BOLETO',
                  referenciaId: boleto.id,
                  descripcion: `Boleto - ${boleto.funcion.pelicula.titulo}`,
                  cantidad: 1,
                  precio: precioBoleto,
                  precioUnitario: precioBoleto,
                  subtotal: precioBoleto,
                }
              }
            },
            include: {
              items: true,
              usuario: { select: { nombre: true, email: true } },
              vendedor: { select: { nombre: true, email: true } }
            }
          });
          
          console.log('✅ BACKEND: Pedido creado para reportes:', pedido.id);
          
          // Actualizar el boleto con el pedidoId para referencia
          await this.prisma.boleto.update({
            where: { id: boleto.id },
            data: { pedidoId: pedido.id }
          });
          
        } catch (errorPedido) {
          console.error('⚠️ BACKEND: Error creando pedido para reportes (boleto ya creado):', errorPedido);
          // No lanzar error aquí para no afectar la venta del boleto
        }
      }
      
      return boleto;
    } catch (error) {
      console.error('❌ BACKEND: Error al crear boleto en base de datos:', error);
      throw error;
    }
  }

  async findAll() {
    console.log('📋 SERVICE: findAll() ejecutado');
    const boletos = await this.prisma.boleto.findMany({
      include: {
        funcion: {
          select: {
            id: true,
            inicio: true,
            precio: true,
            pelicula: {
              select: {
                id: true,
                titulo: true,
              },
            },
            sala: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        asiento: {
          select: {
            id: true,
            fila: true,
            numero: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`✅ SERVICE: ${boletos.length} boletos encontrados`);
    return boletos;
  }

  async findOne(id: string) {
    const boleto = await this.prisma.boleto.findUnique({
      where: { id },
      include: {
        funcion: {
          include: {
            pelicula: { select: { titulo: true, posterUrl: true } },
            sala: { select: { nombre: true } },
          },
        },
        asiento: true,
        usuario: { select: { nombre: true, email: true } },
      },
    });

    if (!boleto) {
      throw new NotFoundException('Boleto no encontrado');
    }

    return boleto;
  }

  async update(id: string, updateBoletoDto: UpdateBoletoDto) {
    await this.findOne(id);

    const updateData: any = {};
    if (updateBoletoDto.funcionId) updateData.funcionId = updateBoletoDto.funcionId;
    if (updateBoletoDto.asientoId) updateData.asientoId = updateBoletoDto.asientoId;
    if (updateBoletoDto.usuarioId !== undefined) updateData.usuarioId = updateBoletoDto.usuarioId;
    if (updateBoletoDto.estado) updateData.estado = updateBoletoDto.estado;
    if (updateBoletoDto.ticketData !== undefined) updateData.ticketData = updateBoletoDto.ticketData;

    console.log('🔧 SERVICE: Actualizando boleto', id);
    console.log('   Datos a actualizar:', {
      tieneTicketData: !!updateData.ticketData,
      tamanioTicketData: updateData.ticketData?.length || 0,
      camposActualizados: Object.keys(updateData)
    });

    const resultado = await this.prisma.boleto.update({
      where: { id },
      data: updateData,
      include: {
        funcion: {
          include: {
            pelicula: { select: { titulo: true } },
            sala: { select: { nombre: true } },
          },
        },
        asiento: true,
        usuario: { select: { nombre: true, email: true } },
      },
    });

    console.log('✅ SERVICE: Boleto actualizado');
    console.log('   Resultado guardado correctamente');
    
    return resultado;
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.boleto.delete({
      where: { id },
    });
  }

  async getBoletosPorFuncion(funcionId: string) {
    console.log('🎫 BACKEND: Obteniendo boletos para función:', funcionId);
    
    // Verificar que la función existe
    const funcionExists = await this.prisma.funcion.findUnique({
      where: { id: funcionId }
    });
    
    if (!funcionExists) {
      console.error('❌ BACKEND: Función no encontrada:', funcionId);
      throw new NotFoundException('Función no encontrada');
    }
    
    const boletos = await this.prisma.boleto.findMany({
      where: { 
        funcionId: funcionId,
        estado: { not: 'CANCELADO' } // Solo boletos activos
      },
      include: {
        asiento: true,
        usuario: { select: { nombre: true, email: true } },
        funcion: {
          include: {
            pelicula: { select: { titulo: true } },
            sala: { select: { nombre: true } },
          },
        },
      },
      orderBy: [
        { asiento: { fila: 'asc' } },
        { asiento: { numero: 'asc' } }
      ]
    });
    
    console.log(`✅ BACKEND: Encontrados ${boletos.length} boletos activos para función ${funcionId}`);
    return boletos;
  }

  async verificarQR(codigoQR: string) {
    // Buscar TODOS los boletos con este código QR (puede haber múltiples)
    const boletos = await this.prisma.boleto.findMany({
      where: { codigoQR },
      include: {
        funcion: {
          include: {
            pelicula: { select: { titulo: true } },
            sala: { select: { nombre: true } },
          },
        },
        asiento: true,
        usuario: { select: { nombre: true } },
      },
    });

    if (!boletos || boletos.length === 0) {
      return { valido: false, mensaje: 'Boleto no encontrado' };
    }

    const boletoPrincipal = boletos[0];

    if (boletoPrincipal.funcion.cancelada) {
      return { valido: false, mensaje: 'Función cancelada' };
    }

    if (boletoPrincipal.estado === 'CANCELADO') {
      return { valido: false, mensaje: 'Boleto cancelado' };
    }

    return {
      valido: true,
      boletos, // Devolver todos los boletos
      cantidad: boletos.length,
      mensaje: boletos.length > 1 
        ? `${boletos.length} boletos válidos` 
        : 'Boleto válido',
    };
  }

  async validarBoleto(codigoQR: string) {
    console.log('🎫 SERVICE: Validando boleto(s) con código QR:', codigoQR);
    
    // Buscar TODOS los boletos con este código QR (puede haber múltiples)
    const boletos = await this.prisma.boleto.findMany({
      where: { codigoQR },
      select: {
        id: true,
        funcionId: true,
        asientoId: true,
        usuarioId: true,
        pedidoId: true,
        estado: true,
        codigoQR: true,
        fechaValidacion: true,
        createdAt: true,
        updatedAt: true,
        funcion: {
          select: {
            id: true,
            inicio: true,
            cancelada: true,
            precio: true,
            pelicula: { 
              select: { 
                titulo: true, 
                posterUrl: true 
              } 
            },
            sala: { 
              select: { 
                nombre: true 
              } 
            },
          },
        },
        asiento: true,
        usuario: { 
          select: { 
            nombre: true, 
            email: true 
          } 
        },
      },
    });

    if (!boletos || boletos.length === 0) {
      console.error('❌ SERVICE: No se encontraron boletos con QR:', codigoQR);
      throw new NotFoundException('Boleto no encontrado');
    }

    console.log(`📊 SERVICE: Encontrados ${boletos.length} boleto(s) con este QR`);

    // Usar el primer boleto como referencia para validaciones
    const boletoPrincipal = boletos[0];

    // ⚠️ VERIFICAR SI YA FUE VALIDADO/ESCANEADO (verificar el primero)
    if (boletoPrincipal.fechaValidacion) {
      console.warn('⚠️ SERVICE: Boletos ya fueron validados anteriormente:', {
        cantidad: boletos.length,
        fechaValidacion: boletoPrincipal.fechaValidacion
      });
      const mensajeError = boletos.length > 1 
        ? `Los ${boletos.length} boletos ya fueron validados el ${boletoPrincipal.fechaValidacion.toLocaleString('es-ES')}`
        : `Boleto ya fue validado el ${boletoPrincipal.fechaValidacion.toLocaleString('es-ES')}`;
      throw new BadRequestException(mensajeError);
    }

    // ⚠️ VERIFICAR ESTADO
    if (boletoPrincipal.estado !== 'PAGADO') {
      console.warn('⚠️ SERVICE: Boletos no están en estado PAGADO:', boletoPrincipal.estado);
      throw new BadRequestException(`Boletos no válidos. Estado: ${boletoPrincipal.estado}`);
    }

    // ⚠️ VERIFICAR FUNCIÓN NO CANCELADA
    if (boletoPrincipal.funcion.cancelada) {
      console.warn('⚠️ SERVICE: La función está cancelada');
      throw new BadRequestException('La función fue cancelada');
    }

    // ✅ MARCAR TODOS LOS BOLETOS COMO VALIDADOS
    const fechaValidacion = new Date();
    await this.prisma.boleto.updateMany({
      where: { codigoQR },
      data: { 
        fechaValidacion,
        estado: 'VALIDADO'
      }
    });

    console.log(`✅ SERVICE: ${boletos.length} boleto(s) validado(s) exitosamente`);

    // Obtener los boletos actualizados
    const boletosValidados = await this.prisma.boleto.findMany({
      where: { codigoQR },
      select: {
        id: true,
        funcionId: true,
        asientoId: true,
        usuarioId: true,
        pedidoId: true,
        estado: true,
        codigoQR: true,
        fechaValidacion: true,
        createdAt: true,
        updatedAt: true,
        funcion: {
          select: {
            id: true,
            inicio: true,
            cancelada: true,
            precio: true,
            pelicula: { 
              select: { 
                titulo: true, 
                posterUrl: true 
              } 
            },
            sala: { 
              select: { 
                nombre: true 
              } 
            },
          },
        },
        asiento: true,
        usuario: { 
          select: { 
            nombre: true, 
            email: true 
          } 
        },
      },
    });

    console.log('✅ SERVICE: Boletos validados exitosamente:', {
      cantidad: boletosValidados.length,
      ids: boletosValidados.map(b => b.id),
      asientos: boletosValidados.map(b => `${b.asiento.fila}-${b.asiento.numero}`),
      fechaValidacion
    });

    // Retornar todos los boletos validados
    return boletosValidados;
  }

  async crearBoletosCompra(data: {
    funcionId: string;
    asientoIds: string[];
    usuarioId?: string;
  }) {
    console.log('🛒 SERVICE: Creando boletos para compra:', data);
    
    // Validar que la función existe
    const funcion = await this.prisma.funcion.findUnique({
      where: { id: data.funcionId },
      include: {
        pelicula: { select: { titulo: true, posterUrl: true } },
        sala: { select: { nombre: true } },
      }
    });
    
    if (!funcion) {
      console.error('❌ SERVICE: Función no encontrada:', data.funcionId);
      throw new NotFoundException('Función no encontrada');
    }

    // Validar que todos los asientos existen
    const asientos = await this.prisma.asiento.findMany({
      where: { id: { in: data.asientoIds } }
    });

    if (asientos.length !== data.asientoIds.length) {
      console.error('❌ SERVICE: Algunos asientos no fueron encontrados');
      throw new NotFoundException('Algunos asientos no fueron encontrados');
    }

    // Verificar que ningún asiento esté ocupado
    const boletosExistentes = await this.prisma.boleto.findMany({
      where: {
        funcionId: data.funcionId,
        asientoId: { in: data.asientoIds },
        estado: { not: 'CANCELADO' }
      }
    });

    if (boletosExistentes.length > 0) {
      console.error('❌ SERVICE: Algunos asientos ya están ocupados');
      throw new BadRequestException('Algunos asientos ya están ocupados para esta función');
    }

    // Generar UN SOLO código QR para toda la compra
    const codigoQRCompra = `COMPRA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('🎫 SERVICE: Código QR único para la compra:', codigoQRCompra);

    // Crear todos los boletos con el MISMO código QR
    const boletos = [];
    for (const asientoId of data.asientoIds) {
      const asiento = asientos.find(a => a.id === asientoId);
      const boleto = await this.prisma.boleto.create({
        data: {
          funcionId: data.funcionId,
          asientoId: asientoId,
          usuarioId: data.usuarioId,
          estado: 'PAGADO', // Cliente ya pagó con tarjeta
          codigoQR: codigoQRCompra, // MISMO QR para todos los boletos de la compra
        },
        include: {
          funcion: {
            include: {
              pelicula: { select: { titulo: true, posterUrl: true } },
              sala: { select: { nombre: true } },
            },
          },
          asiento: true,
          usuario: { select: { nombre: true, email: true } },
        },
      });

      boletos.push(boleto);
      console.log('✅ SERVICE: Boleto creado:', {
        id: boleto.id,
        codigoQR: boleto.codigoQR,
        asiento: `${boleto.asiento.fila}-${boleto.asiento.numero}`
      });
    }

    console.log(`✅ SERVICE: ${boletos.length} boletos creados exitosamente con QR compartido: ${codigoQRCompra}`);

    // 🆕 CREAR PEDIDO para que aparezca en los reportes
    if (data.usuarioId && boletos.length > 0) {
      try {
        // Calcular el total de la compra (Decimal * cantidad)
        const precioBoleto = Number(funcion.precio);
        const totalCompra = precioBoleto * boletos.length;

        // Crear el Pedido
        const pedido = await this.prisma.pedido.create({
          data: {
            usuarioId: data.usuarioId,
            total: totalCompra,
            tipo: 'WEB', // Tipo correcto según el enum PedidoTipo
            estado: 'COMPLETADO',
            metodoPago: 'TARJETA',
            items: {
              create: boletos.map(boleto => ({
                tipo: 'BOLETO',
                referenciaId: boleto.id,
                descripcion: `${funcion.pelicula.titulo} - ${funcion.sala.nombre} - Asiento ${boleto.asiento.fila}${boleto.asiento.numero}`,
                cantidad: 1,
                precio: funcion.precio,
                precioUnitario: funcion.precio,
                subtotal: funcion.precio,
              }))
            }
          }
        });

        // Actualizar los boletos con el pedidoId
        await this.prisma.boleto.updateMany({
          where: { id: { in: boletos.map(b => b.id) } },
          data: { pedidoId: pedido.id }
        });

        console.log('✅ SERVICE: Pedido creado para compra online:', {
          pedidoId: pedido.id,
          total: pedido.total,
          cantidadItems: boletos.length
        });
      } catch (error) {
        console.error('⚠️ SERVICE: Error al crear pedido para compra online:', error);
        // No lanzar error, los boletos ya fueron creados exitosamente
      }
    }

    return boletos;
  }
}
