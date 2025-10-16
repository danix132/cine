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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SalasService } from './salas.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { UpdateAsientosDanadosDto } from './dto/update-asientos-danados.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('salas')
@Controller('salas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nueva sala (solo admin)' })
  @ApiResponse({ status: 201, description: 'Sala creada exitosamente' })
  create(@Body() createSalaDto: CreateSalaDto) {
    return this.salasService.create(createSalaDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.VENDEDOR) // Permitir también vendedores
  @ApiOperation({ summary: 'Obtener todas las salas' })
  @ApiResponse({ status: 200, description: 'Lista de salas' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.salasService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener sala por ID con asientos' })
  @ApiResponse({ status: 200, description: 'Sala encontrada' })
  @ApiResponse({ status: 404, description: 'Sala no encontrada' })
  findOne(@Param('id') id: string) {
    return this.salasService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar sala (solo admin)' })
  @ApiResponse({ status: 200, description: 'Sala actualizada' })
  @ApiResponse({ status: 404, description: 'Sala no encontrada' })
  async update(@Param('id') id: string, @Body() updateSalaDto: UpdateSalaDto) {
    console.log('🎯 Controller update - ID:', id);
    console.log('🎯 Controller update - DTO:', updateSalaDto);
    console.log('🎯 Controller update - DTO tipos:', {
      nombre: typeof updateSalaDto.nombre,
      filas: typeof updateSalaDto.filas,
      asientosPorFila: typeof updateSalaDto.asientosPorFila
    });
    
    try {
      const result = await this.salasService.update(id, updateSalaDto);
      console.log('🎯 Controller update - Resultado exitoso');
      return result;
    } catch (error) {
      console.error('🎯 Controller update - Error:', error);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar sala (solo admin)' })
  @ApiResponse({ status: 200, description: 'Sala eliminada' })
  @ApiResponse({ status: 404, description: 'Sala no encontrada' })
  remove(@Param('id') id: string) {
    return this.salasService.remove(id);
  }

  @Patch(':id/asientos-danados')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar asientos dañados (solo admin)' })
  @ApiResponse({ status: 200, description: 'Asientos dañados actualizados' })
  updateAsientosDanados(
    @Param('id') id: string,
    @Body() updateAsientosDanadosDto: UpdateAsientosDanadosDto,
  ) {
    return this.salasService.updateAsientosDanados(id, updateAsientosDanadosDto);
  }

  @Get(':id/asientos/:funcionId')
  @ApiOperation({ summary: 'Obtener disponibilidad de asientos para una función' })
  @ApiResponse({ status: 200, description: 'Disponibilidad de asientos' })
  getAsientosDisponibilidad(
    @Param('id') id: string,
    @Param('funcionId') funcionId: string,
  ) {
    return this.salasService.getAsientosDisponibilidad(id, funcionId);
  }
}
