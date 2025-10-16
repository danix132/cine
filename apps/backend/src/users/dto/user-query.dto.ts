import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

export class UserQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: UserRole })
  rol?: UserRole;
}