import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR', 'CLIENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  findAll(@Query() query: any) {
    return this.pedidosService.findAll(query);
  }

  @Get('mios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mis pedidos (cliente)' })
  findMyOrders(@Query('usuarioId') usuarioId: string) {
    return this.pedidosService.findMyOrders(usuarioId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR', 'CLIENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR', 'CLIENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un pedido' })
  async update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    console.log('🔄 CONTROLLER: PATCH /pedidos/:id llamado');
    console.log('   ID del pedido:', id);
    console.log('   Datos a actualizar:', {
      tieneTicketData: !!updatePedidoDto.ticketData,
      tamanioTicketData: updatePedidoDto.ticketData?.length || 0,
      camposActualizados: Object.keys(updatePedidoDto)
    });
    
    try {
      const resultado = await this.pedidosService.update(id, updatePedidoDto);
      console.log('✅ CONTROLLER: Pedido actualizado exitosamente');
      return resultado;
    } catch (error) {
      console.error('❌ CONTROLLER: Error al actualizar pedido:', error.message);
      throw error;
    }
  }

  @Post(':id/entregar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar un pedido de dulcería como entregado' })
  marcarComoEntregado(
    @Param('id') id: string,
    @Body('vendedorId') vendedorId: string
  ) {
    return this.pedidosService.marcarComoEntregado(id, vendedorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un pedido' })
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(id);
  }
}
