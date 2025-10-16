import { IsString, IsNumber, Min, MinLength, MaxLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DulceriaItemTipo } from '@prisma/client';

export class CreateDulceriaItemDto {
  @ApiProperty({ example: 'Combo Nachos Grande', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ enum: DulceriaItemTipo, example: DulceriaItemTipo.COMBO })
  @IsEnum(DulceriaItemTipo)
  tipo: DulceriaItemTipo;

  @ApiPropertyOptional({ example: 'Nachos con queso, guacamole y salsa', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @ApiProperty({ example: 89.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiPropertyOptional({ example: 'https://example.com/imagen-nachos.jpg' })
  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
