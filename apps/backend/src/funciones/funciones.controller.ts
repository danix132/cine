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
import { FuncionesService } from './funciones.service';
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { UpdateFuncionDto } from './dto/update-funcion.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('funciones')
@Controller('funciones')
export class FuncionesController {
  constructor(private readonly funcionesService: FuncionesService) {}

  @Post('debug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Debug: Analizar conflictos sin crear función' })
  debugConflictos(@Body() createFuncionDto: CreateFuncionDto) {
    return this.funcionesService.debugConflictos(createFuncionDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva función (solo admin)' })
  @ApiResponse({ status: 201, description: 'Función creada exitosamente' })
  @ApiResponse({ status: 409, description: 'Conflicto de horario' })
  create(@Body() createFuncionDto: CreateFuncionDto) {
    return this.funcionesService.create(createFuncionDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener todas las funciones (público)' })
  @ApiResponse({ status: 200, description: 'Lista de funciones' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.funcionesService.findAll(paginationDto);
  }

  @Get('proximas')
  @Public()
  @ApiOperation({ summary: 'Obtener funciones próximas (público)' })
  @ApiResponse({ status: 200, description: 'Funciones próximas' })
  findUpcoming() {
    return this.funcionesService.findUpcoming();
  }

  @Get('disponibles')
  @Public()
  @ApiOperation({ summary: 'Obtener funciones disponibles para venta (público)' })
  @ApiResponse({ status: 200, description: 'Funciones disponibles' })
  findDisponibles() {
    return this.funcionesService.findUpcoming(); // Reutilizar el mismo método
  }

  @Get('pelicula/:peliculaId')
  @Public()
  @ApiOperation({ summary: 'Buscar funciones por película (público)' })
  @ApiResponse({ status: 200, description: 'Funciones de la película' })
  findByPelicula(@Param('peliculaId') peliculaId: string) {
    return this.funcionesService.findByPelicula(peliculaId);
  }

  @Get('sala/:salaId')
  @Public()
  @ApiOperation({ summary: 'Buscar funciones por sala (público)' })
  @ApiResponse({ status: 200, description: 'Funciones de la sala' })
  findBySala(@Param('salaId') salaId: string) {
    return this.funcionesService.findBySala(salaId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener función por ID (público)' })
  @ApiResponse({ status: 200, description: 'Función encontrada' })
  @ApiResponse({ status: 404, description: 'Función no encontrada' })
  findOne(@Param('id') id: string) {
    return this.funcionesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar función (solo admin)' })
  @ApiResponse({ status: 200, description: 'Función actualizada' })
  @ApiResponse({ status: 404, description: 'Función no encontrada' })
  update(@Param('id') id: string, @Body() updateFuncionDto: UpdateFuncionDto) {
    return this.funcionesService.update(id, updateFuncionDto);
  }

  @Post(':id/cancelar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar función (solo admin)' })
  @ApiResponse({ status: 200, description: 'Función cancelada' })
  @ApiResponse({ status: 400, description: 'No se puede cancelar' })
  cancelar(@Param('id') id: string) {
    return this.funcionesService.cancelar(id);
  }

  @Post(':id/reactivar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivar función cancelada (solo admin)' })
  @ApiResponse({ status: 200, description: 'Función reactivada' })
  @ApiResponse({ status: 400, description: 'No se puede reactivar' })
  @ApiResponse({ status: 409, description: 'Conflicto de horario al reactivar' })
  reactivar(@Param('id') id: string) {
    return this.funcionesService.reactivar(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar función (solo admin)' })
  @ApiResponse({ status: 200, description: 'Función eliminada' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar' })
  remove(@Param('id') id: string) {
    return this.funcionesService.remove(id);
  }
}
