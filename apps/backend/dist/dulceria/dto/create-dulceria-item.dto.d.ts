import { DulceriaItemTipo } from '@prisma/client';
export declare class CreateDulceriaItemDto {
    nombre: string;
    tipo: DulceriaItemTipo;
    descripcion?: string;
    precio: number;
    imagenUrl?: string;
    stock?: number;
    activo?: boolean;
}
