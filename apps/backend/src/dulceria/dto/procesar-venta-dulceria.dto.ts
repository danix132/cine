import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ItemVentaDto {
  @ApiProperty({ description: 'ID del producto de dulcería' })
  @IsString()
  @IsNotEmpty()
  dulceriaItemId: string;

  @ApiProperty({ description: 'Cantidad a vender' })
  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class ProcesarVentaDulceriaDto {
  @ApiProperty({ 
    description: 'Items de dulcería a vender',
    type: [ItemVentaDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemVentaDto)
  items: ItemVentaDto[];
}
