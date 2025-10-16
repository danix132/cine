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
import { CarritosService } from './carritos.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('carritos')
@Controller('carritos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CarritosController {
  constructor(private readonly carritosService: CarritosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo carrito' })
  @ApiResponse({ status: 201, description: 'Carrito creado exitosamente' })
  create(@Body() createCarritoDto: CreateCarritoDto, @Request() req) {
    const { user } = req;
    const userId = user.rol === 'CLIENTE' ? user.id : undefined;
    const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
    
    return this.carritosService.create(createCarritoDto, userId, vendedorId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los carritos (solo admin)' })
  @ApiResponse({ status: 200, description: 'Lista de carritos' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.carritosService.findAll(paginationDto);
  }

  @Get('mi-carrito')
  @ApiOperation({ summary: 'Obtener carrito del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Carrito encontrado' })
  @ApiResponse({ status: 404, description: 'Carrito no encontrado' })
  getMyCarrito(@Request() req) {
    const { user } = req;
    if (user.rol === 'CLIENTE') {
      return this.carritosService.getCarritoByUser(user.id);
    } else if (user.rol === 'VENDEDOR') {
      return this.carritosService.getCarritoByVendedor(user.id);
    }
    throw new Error('Rol no válido para obtener carrito');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carrito por ID' })
  @ApiResponse({ status: 200, description: 'Carrito encontrado' })
  @ApiResponse({ status: 404, description: 'Carrito no encontrado' })
  findOne(@Param('id') id: string, @Request() req) {
    const { user } = req;
    const userId = user.rol === 'CLIENTE' ? user.id : undefined;
    const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
    
    return this.carritosService.findOne(id, userId, vendedorId);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Agregar item al carrito' })
  @ApiResponse({ status: 201, description: 'Item agregado exitosamente' })
  addItem(
    @Param('id') id: string,
    @Body() addItemDto: AddItemDto,
    @Request() req,
  ) {
    const { user } = req;
    const userId = user.rol === 'CLIENTE' ? user.id : undefined;
    const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
    
    return this.carritosService.addItem(id, addItemDto, userId, vendedorId);
  }

  @Patch(':id/items/:itemId')
  @ApiOperation({ summary: 'Actualizar item del carrito' })
  @ApiResponse({ status: 200, description: 'Item actualizado' })
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
    @Request() req,
  ) {
    const { user } = req;
    const userId = user.rol === 'CLIENTE' ? user.id : undefined;
    const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
    
    return this.carritosService.updateItem(id, itemId, updateItemDto, userId, vendedorId);
  }

  @Delete(':id/items/:itemId')
  @ApiOperation({ summary: 'Eliminar item del carrito' })
  @ApiResponse({ status: 200, description: 'Item eliminado' })
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Request() req,
  ) {
    const { user } = req;
    const userId = user.rol === 'CLIENTE' ? user.id : undefined;
    const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
    
    return this.carritosService.removeItem(id, itemId, userId, vendedorId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carrito' })
  @ApiResponse({ status: 200, description: 'Carrito eliminado' })
  remove(@Param('id') id: string, @Request() req) {
    const { user } = req;
    const userId = user.rol === 'CLIENTE' ? user.id : undefined;
    const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
    
    return this.carritosService.remove(id, userId, vendedorId);
  }

  @Get(':id/total')
  @ApiOperation({ summary: 'Calcular total del carrito' })
  @ApiResponse({ status: 200, description: 'Total calculado' })
  calcularTotal(@Param('id') id: string, @Request() req) {
    const { user } = req;
    const userId = user.rol === 'CLIENTE' ? user.id : undefined;
    const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
    
    return this.carritosService.calcularTotal(id);
  }
}
