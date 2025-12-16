import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreferenciasDto {
  @ApiPropertyOptional({ 
    example: 'Acción,Comedia,Drama,Ciencia Ficción',
    description: 'Géneros preferidos separados por comas'
  })
  @IsOptional()
  @IsString()
  generosPreferidos?: string;
}
