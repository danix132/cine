import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PedidoTipo, PedidoItemTipo } from '@prisma/client';

export class CreatePedidoItemDto {
  @ApiProperty({ description: 'Tipo de item', enum: PedidoItemTipo })
  @IsEnum(PedidoItemTipo)
  @IsNotEmpty()
  tipo: PedidoItemTipo;

  @ApiProperty({ description: 'ID de referencia (boleto o dulcería)' })
  @IsString()
  @IsNotEmpty()
  referenciaId: string;

  @ApiProperty({ description: 'Descripción del item', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ description: 'Cantidad' })
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @ApiProperty({ description: 'Precio unitario' })
  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @ApiProperty({ description: 'Precio unitario (compatibilidad)' })
  @IsNumber()
  @IsNotEmpty()
  precioUnitario: number;

  @ApiProperty({ description: 'Subtotal del item', required: false })
  @IsNumber()
  @IsOptional()
  subtotal?: number;
}

export class CreatePedidoDto {
  @ApiProperty({ description: 'ID del usuario (opcional)' })
  @IsString()
  @IsOptional()
  usuarioId?: string;

  @ApiProperty({ description: 'ID del vendedor (opcional)' })
  @IsString()
  @IsOptional()
  vendedorId?: string;

  @ApiProperty({ description: 'Total del pedido' })
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiProperty({ description: 'Tipo de pedido', enum: PedidoTipo })
  @IsEnum(PedidoTipo)
  @IsNotEmpty()
  tipo: PedidoTipo;

  @ApiProperty({ description: 'Items del pedido', type: [CreatePedidoItemDto] })
  @IsArray()
  @IsNotEmpty()
  items: CreatePedidoItemDto[];

  @ApiProperty({ description: 'Ticket en base64 (opcional)' })
  @IsString()
  @IsOptional()
  ticketData?: string;
}
