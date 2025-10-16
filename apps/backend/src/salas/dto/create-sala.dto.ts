import { IsString, IsInt, Min, Max, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalaDto {
  @ApiProperty({ example: 'Sala 1', minLength: 2, maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ example: 10, minimum: 1, maximum: 20 })
  @Transform(({ value }) => {
    console.log('🔢 Transformando filas:', value, typeof value);
    return parseInt(value);
  })
  @IsInt()
  @Min(1)
  @Max(20)
  filas: number;

  @ApiProperty({ example: 15, minimum: 1, maximum: 25 })
  @Transform(({ value }) => {
    console.log('🔢 Transformando asientosPorFila:', value, typeof value);
    return parseInt(value);
  })
  @IsInt()
  @Min(1)
  @Max(25)
  asientosPorFila: number;
}
