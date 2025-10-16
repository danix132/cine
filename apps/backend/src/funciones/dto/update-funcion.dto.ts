import { PartialType } from '@nestjs/swagger';
import { CreateFuncionDto } from './create-funcion.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateFuncionDto extends PartialType(CreateFuncionDto) {
  @IsOptional()
  @IsBoolean()
  forzarActualizacion?: boolean;
}
