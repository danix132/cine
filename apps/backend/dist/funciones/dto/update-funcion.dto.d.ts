import { CreateFuncionDto } from './create-funcion.dto';
declare const UpdateFuncionDto_base: import("@nestjs/common").Type<Partial<CreateFuncionDto>>;
export declare class UpdateFuncionDto extends UpdateFuncionDto_base {
    forzarActualizacion?: boolean;
}
export {};
