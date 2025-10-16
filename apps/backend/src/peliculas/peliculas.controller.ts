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
import { PeliculasService } from './peliculas.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('peliculas')
@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva película (solo admin)' })
  @ApiResponse({ status: 201, description: 'Película creada exitosamente' })
  create(@Body() createPeliculaDto: CreatePeliculaDto) {
    return this.peliculasService.create(createPeliculaDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener todas las películas (público)' })
  @ApiResponse({ status: 200, description: 'Lista de películas' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.peliculasService.findAll(paginationDto);
  }

  @Get('activas')
  @Public()
  @ApiOperation({ summary: 'Obtener películas activas con funciones (público)' })
  @ApiResponse({ status: 200, description: 'Películas activas' })
  findActive() {
    return this.peliculasService.findActive();
  }

  @Get('genero/:genero')
  @Public()
  @ApiOperation({ summary: 'Buscar películas por género (público)' })
  @ApiResponse({ status: 200, description: 'Películas del género' })
  findByGenero(@Param('genero') genero: string) {
    return this.peliculasService.findByGenero(genero);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener película por ID con funciones (público)' })
  @ApiResponse({ status: 200, description: 'Película encontrada' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  findOne(@Param('id') id: string) {
    return this.peliculasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar película (solo admin)' })
  @ApiResponse({ status: 200, description: 'Película actualizada' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  update(@Param('id') id: string, @Body() updatePeliculaDto: UpdatePeliculaDto) {
    return this.peliculasService.update(id, updatePeliculaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar película (solo admin)' })
  @ApiResponse({ status: 200, description: 'Película eliminada' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  remove(@Param('id') id: string) {
    return this.peliculasService.remove(id);
  }

  @Delete(':id/forzar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Forzar eliminación completa de película (solo admin) - CUIDADO: Elimina todo incluidos boletos' })
  @ApiResponse({ status: 200, description: 'Película forzadamente eliminada' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  forceRemove(@Param('id') id: string) {
    return this.peliculasService.forceRemove(id);
  }
}
