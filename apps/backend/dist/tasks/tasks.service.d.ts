import { CarritosService } from '../carritos/carritos.service';
export declare class TasksService {
    private readonly carritosService;
    private readonly logger;
    constructor(carritosService: CarritosService);
    limpiarCarritosExpirados(): Promise<void>;
    limpiarLogsAntiguos(): Promise<void>;
}
