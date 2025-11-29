import { IsString, IsInt, Min, MinLength, MaxLength, IsArray, IsOptional, IsEnum, IsUrl, IsBoolean, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PeliculaEstado } from '@prisma/client';

export class CreatePeliculaDto {
  @ApiProperty({ example: 'Avengers: Endgame', minLength: 2, maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  titulo: string;

  @ApiPropertyOptional({ example: 'Los Vengadores se reúnen una vez más...' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sinopsis?: string;

  @ApiProperty({ example: 181, minimum: 1 })
  @IsInt()
  @Min(1)
  duracionMin: number;

  @ApiProperty({ example: 'B-13', minLength: 1, maxLength: 10 })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  clasificacion: string;

  @ApiPropertyOptional({ example: 'https://example.com/poster.jpg' })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=...' })
  @IsOptional()
  @IsUrl()
  trailerUrl?: string;

  @ApiProperty({ example: ['Acción', 'Aventura', 'Ciencia Ficción'] })
  @IsArray()
  @IsString({ each: true })
  generos: string[];

  @ApiPropertyOptional({ enum: PeliculaEstado, default: PeliculaEstado.ACTIVA })
  @IsOptional()
  @IsEnum(PeliculaEstado)
  estado?: PeliculaEstado;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  esProximoEstreno?: boolean;

  @ApiPropertyOptional({ example: '2025-12-25T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  fechaEstreno?: string;
}
