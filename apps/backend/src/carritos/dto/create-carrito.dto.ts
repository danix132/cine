import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CarritoTipo } from '@prisma/client';

export class CreateCarritoDto {
  @ApiProperty({ enum: CarritoTipo, example: CarritoTipo.CLIENTE })
  @IsEnum(CarritoTipo)
  tipo: CarritoTipo;
}
