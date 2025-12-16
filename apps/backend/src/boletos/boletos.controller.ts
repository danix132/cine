import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('boletos')
@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo boleto' })
  async create(@Body() createBoletoDto: CreateBoletoDto) {
    console.log('🎯 CONTROLLER: POST /boletos llamado con:', JSON.stringify(createBoletoDto, null, 2));
    console.log('🔍 CONTROLLER: Tipo de datos recibidos:', {
      funcionId: typeof createBoletoDto.funcionId,
      asientoId: typeof createBoletoDto.asientoId,
      usuarioId: typeof createBoletoDto.usuarioId,
      estado: typeof createBoletoDto.estado,
      vendedorId: typeof createBoletoDto.vendedorId,
    });
    console.log('👤 CONTROLLER: VendedorId recibido:', createBoletoDto.vendedorId || 'NO PROPORCIONADO');
    
    try {
      const result = await this.boletosService.create(createBoletoDto);
      console.log('✅ CONTROLLER: Boleto creado exitosamente:', result.id);
      return result;
    } catch (error) {
      console.error('❌ CONTROLLER: Error al crear boleto:', error.message);
      console.error('❌ CONTROLLER: Stack trace:', error.stack);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los boletos con relaciones' })
  findAll() {
    console.log('📋 CONTROLLER: GET /boletos llamado');
    return this.boletosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR', 'CLIENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un boleto por ID' })
  findOne(@Param('id') id: string) {
    return this.boletosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR', 'CLIENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un boleto' })
  async update(@Param('id') id: string, @Body() updateBoletoDto: UpdateBoletoDto) {
    console.log('🔄 CONTROLLER: PATCH /boletos/:id llamado');
    console.log('   ID del boleto:', id);
    console.log('   Datos a actualizar:', {
      tieneTicketData: !!updateBoletoDto.ticketData,
      tamanioTicketData: updateBoletoDto.ticketData?.length || 0,
      camposActualizados: Object.keys(updateBoletoDto)
    });
    
    try {
      const resultado = await this.boletosService.update(id, updateBoletoDto);
      console.log('✅ CONTROLLER: Boleto actualizado exitosamente');
      return resultado;
    } catch (error) {
      console.error('❌ CONTROLLER: Error al actualizar boleto:', error.message);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un boleto' })
  remove(@Param('id') id: string) {
    return this.boletosService.remove(id);
  }

  @Get('funcion/:funcionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR', 'CLIENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener boletos por función' })
  getBoletosPorFuncion(@Param('funcionId') funcionId: string) {
    console.log('🎯 CONTROLLER: GET /boletos/funcion/' + funcionId);
    return this.boletosService.getBoletosPorFuncion(funcionId);
  }

  @Post('verificar-qr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar un boleto por código QR' })
  verificarQR(@Body() body: { codigoQR: string }) {
    return this.boletosService.verificarQR(body.codigoQR);
  }

  @Get('validar/:codigoQR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDEDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar un boleto para ingreso por código QR' })
  async validarBoleto(@Param('codigoQR') codigoQR: string) {
    console.log('🎫 CONTROLLER: Validando boleto con QR:', codigoQR);
    const resultado = await this.boletosService.validarBoleto(codigoQR);
    console.log('📤 CONTROLLER: Devolviendo resultado:', {
      cantidad: Array.isArray(resultado) ? resultado.length : 1,
      esArray: Array.isArray(resultado),
      primerBoleto: Array.isArray(resultado) ? resultado[0]?.id : resultado
    });
    return resultado;
  }

  @Post('compra')
  @ApiOperation({ summary: 'Crear múltiples boletos para una compra de cliente' })
  async crearBoletosCompra(@Body() body: {
    funcionId: string;
    asientoIds: string[];
    usuarioId?: string;
  }) {
    console.log('🛒 CONTROLLER: POST /boletos/compra llamado con:', body);
    try {
      const boletos = await this.boletosService.crearBoletosCompra(body);
      console.log('✅ CONTROLLER: Boletos de compra creados:', boletos.length);
      return boletos;
    } catch (error) {
      console.error('❌ CONTROLLER: Error al crear boletos de compra:', error.message);
      throw error;
    }
  }
}
