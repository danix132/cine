import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CarritosService } from '../carritos/carritos.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly carritosService: CarritosService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async limpiarCarritosExpirados() {
    try {
      const resultado = await this.carritosService.limpiarCarritosExpirados();
      this.logger.log(`Tarea programada ejecutada: ${resultado.message}`);
    } catch (error) {
      this.logger.error('Error al limpiar carritos expirados:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async limpiarLogsAntiguos() {
    try {
      this.logger.log('Limpiando logs antiguos...');
      // Aquí se pueden implementar tareas de limpieza de logs
    } catch (error) {
      this.logger.error('Error al limpiar logs antiguos:', error);
    }
  }
}
