import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DulceriaService } from './dulceria.service';
import { CreateDulceriaItemDto } from './dto/create-dulceria-item.dto';
import { UpdateDulceriaItemDto } from './dto/update-dulceria-item.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('dulceria')
@Controller('dulceria')
export class DulceriaController {
  constructor(private readonly dulceriaService: DulceriaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo item de dulcería (solo admin)' })
  @ApiResponse({ status: 201, description: 'Item creado exitosamente' })
  create(@Body() createDulceriaItemDto: CreateDulceriaItemDto) {
    return this.dulceriaService.create(createDulceriaItemDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener todos los items de dulcería (público)' })
  @ApiResponse({ status: 200, description: 'Lista de items' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.dulceriaService.findAll(paginationDto);
  }

  @Get('activos')
  @Public()
  @ApiOperation({ summary: 'Obtener items activos de dulcería (público)' })
  @ApiResponse({ status: 200, description: 'Items activos' })
  findActive() {
    return this.dulceriaService.findActive();
  }

  @Get('tipo/:tipo')
  @Public()
  @ApiOperation({ summary: 'Buscar items por tipo (público)' })
  @ApiResponse({ status: 200, description: 'Items del tipo' })
  findByTipo(@Param('tipo') tipo: string) {
    return this.dulceriaService.findByTipo(tipo);
  }

  @Get('inventario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDEDOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener inventario (admin/vendedor)' })
  @ApiResponse({ status: 200, description: 'Inventario obtenido' })
  obtenerInventario() {
    return this.dulceriaService.obtenerInventario();
  }

  @Post('venta')
  @Post('venta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENTE, UserRole.VENDEDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Procesar venta de dulcería (clientes, vendedor/admin)' })
  @ApiResponse({ status: 201, description: 'Venta procesada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async procesarVenta(
    @Body() procesarVentaDulceriaDto: any,
    @Request() req: any,
  ) {
    console.log('🍿 CONTROLLER: Procesando venta de dulcería');
    console.log('📦 Items recibidos:', procesarVentaDulceriaDto.items);
    console.log('👤 Usuario:', req.user);
    
    return this.dulceriaService.procesarVenta(procesarVentaDulceriaDto, req.user.id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener item por ID (público)' })
  @ApiResponse({ status: 200, description: 'Item encontrado' })
  @ApiResponse({ status: 404, description: 'Item no encontrado' })
  findOne(@Param('id') id: string) {
    return this.dulceriaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar item (solo admin)' })
  @ApiResponse({ status: 200, description: 'Item actualizado' })
  @ApiResponse({ status: 404, description: 'Item no encontrado' })
  update(@Param('id') id: string, @Body() updateDulceriaItemDto: UpdateDulceriaItemDto) {
    return this.dulceriaService.update(id, updateDulceriaItemDto);
  }

  @Patch(':id/activar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar item (solo admin)' })
  @ApiResponse({ status: 200, description: 'Item activado' })
  activar(@Param('id') id: string) {
    return this.dulceriaService.activar(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar item (solo admin)' })
  @ApiResponse({ status: 200, description: 'Item desactivado' })
  remove(@Param('id') id: string) {
    return this.dulceriaService.remove(id);
  }
}
