import { IsInt, Min, IsNumber, Min as MinNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateItemDto {
  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  cantidad?: number;

  @ApiPropertyOptional({ example: 160.00, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @MinNumber(0)
  precioUnitario?: number;
}
