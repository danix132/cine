import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBoletoDto {
  @ApiProperty({ description: 'ID de la función' })
  @IsString()
  @IsNotEmpty()
  funcionId: string;

  @ApiProperty({ description: 'ID del asiento' })
  @IsString()
  @IsNotEmpty()
  asientoId: string;

  @ApiProperty({ description: 'ID del usuario (opcional)' })
  @IsString()
  @IsOptional()
  usuarioId?: string;

  @ApiProperty({ description: 'Estado del boleto', enum: ['RESERVADO', 'PAGADO', 'CANCELADO'] })
  @IsEnum(['RESERVADO', 'PAGADO', 'CANCELADO'])
  @IsOptional()
  estado?: string;

  @ApiProperty({ description: 'ID del vendedor (requerido para ventas en efectivo)', required: false })
  @IsString()
  @IsOptional()
  vendedorId?: string;

  @ApiProperty({ description: 'Precio del boleto (opcional, se usa el de la función si no se especifica)', required: false })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  precio?: number;

  @ApiProperty({ description: 'Ticket en base64 (opcional)', required: false })
  @IsString()
  @IsOptional()
  ticketData?: string;
}
