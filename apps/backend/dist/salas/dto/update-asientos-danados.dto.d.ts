export declare enum AsientoEstadoDto {
    DISPONIBLE = "DISPONIBLE",
    DANADO = "DANADO",
    NO_EXISTE = "NO_EXISTE"
}
declare class AsientoDanadoDto {
    fila: number;
    numero: number;
    estado?: AsientoEstadoDto;
}
export declare class UpdateAsientosDanadosDto {
    asientosDanados: AsientoDanadoDto[];
}
export {};
