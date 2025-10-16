import { CarritoItemTipo } from '@prisma/client';
export declare class AddItemDto {
    tipo: CarritoItemTipo;
    referenciaId: string;
    cantidad: number;
    precioUnitario: number;
}
