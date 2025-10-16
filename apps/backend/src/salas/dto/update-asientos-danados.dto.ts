import { IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AsientoDanadoDto {
  @ApiProperty({ example: 5, minimum: 1 })
  @IsInt()
  @Min(1)
  fila: number;

  @ApiProperty({ example: 10, minimum: 1 })
  @IsInt()
  @Min(1)
  numero: number;
}

export class UpdateAsientosDanadosDto {
  @ApiProperty({ type: [AsientoDanadoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsientoDanadoDto)
  asientosDanados: AsientoDanadoDto[];
}
