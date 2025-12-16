import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { CreatePedidoDto } from './create-pedido.dto';
import { PedidoEstado } from '@prisma/client';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @ApiProperty({ description: 'Estado del pedido', enum: PedidoEstado, required: false })
  @IsEnum(PedidoEstado)
  @IsOptional()
  estado?: PedidoEstado;

  @ApiProperty({ description: 'Si el pedido fue entregado', required: false })
  @IsBoolean()
  @IsOptional()
  entregado?: boolean;

  @ApiProperty({ description: 'Fecha de entrega', required: false })
  @IsString()
  @IsOptional()
  fechaEntrega?: string;
}
