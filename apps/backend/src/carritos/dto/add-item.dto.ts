import { IsEnum, IsString, IsInt, Min, IsNumber, Min as MinNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CarritoItemTipo } from '@prisma/client';

export class AddItemDto {
  @ApiProperty({ enum: CarritoItemTipo, example: CarritoItemTipo.BOLETO })
  @IsEnum(CarritoItemTipo)
  tipo: CarritoItemTipo;

  @ApiProperty({ example: 'clm1234567890abcdef' })
  @IsString()
  referenciaId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 150.00, minimum: 0 })
  @IsNumber()
  @MinNumber(0)
  precioUnitario: number;
}
