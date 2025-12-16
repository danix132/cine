import { IsArray, ValidateNested, IsInt, Min, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum AsientoEstadoDto {
  DISPONIBLE = 'DISPONIBLE',
  DANADO = 'DANADO',
  NO_EXISTE = 'NO_EXISTE'
}

class AsientoDanadoDto {
  @ApiProperty({ example: 5, minimum: 1 })
  @IsInt()
  @Min(1)
  fila: number;

  @ApiProperty({ example: 10, minimum: 1 })
  @IsInt()
  @Min(1)
  numero: number;

  @ApiProperty({ enum: AsientoEstadoDto, required: false })
  @IsOptional()
  @IsEnum(AsientoEstadoDto)
  estado?: AsientoEstadoDto;
}

export class UpdateAsientosDanadosDto {
  @ApiProperty({ type: [AsientoDanadoDto], required: true, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsientoDanadoDto)
  asientosDanados: AsientoDanadoDto[];
}
