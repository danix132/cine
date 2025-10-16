import { PartialType } from '@nestjs/swagger';
import { CreateDulceriaItemDto } from './create-dulceria-item.dto';

export class UpdateDulceriaItemDto extends PartialType(CreateDulceriaItemDto) {}
