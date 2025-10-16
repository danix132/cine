import { IsString, IsNumber, Min, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFuncionDto {
  @ApiProperty({ example: 'clm1234567890abcdef' })
  @IsString()
  peliculaId: string;

  @ApiProperty({ example: 'cls1234567890abcdef' })
  @IsString()
  salaId: string;

  @ApiProperty({ example: '2024-01-15T20:00:00.000Z' })
  @IsDateString()
  inicio: string;

  @ApiProperty({ example: 150.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  forzarCreacion?: boolean;
}
