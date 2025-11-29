import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreatePeliculaDto } from './create-pelicula.dto';

export class UpdatePeliculaDto extends PartialType(CreatePeliculaDto) {
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  esProximoEstreno?: boolean;

  @ApiPropertyOptional({ example: '2025-12-25T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  fechaEstreno?: string;
}
