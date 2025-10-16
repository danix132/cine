import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';
export declare class UserQueryDto extends PaginationDto {
    rol?: UserRole;
}
