"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const carritos_service_1 = require("../carritos/carritos.service");
let TasksService = TasksService_1 = class TasksService {
    constructor(carritosService) {
        this.carritosService = carritosService;
        this.logger = new common_1.Logger(TasksService_1.name);
    }
    async limpiarCarritosExpirados() {
        try {
            const resultado = await this.carritosService.limpiarCarritosExpirados();
            this.logger.log(`Tarea programada ejecutada: ${resultado.message}`);
        }
        catch (error) {
            this.logger.error('Error al limpiar carritos expirados:', error);
        }
    }
    async limpiarLogsAntiguos() {
        try {
            this.logger.log('Limpiando logs antiguos...');
        }
        catch (error) {
            this.logger.error('Error al limpiar logs antiguos:', error);
        }
    }
};
exports.TasksService = TasksService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "limpiarCarritosExpirados", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "limpiarLogsAntiguos", null);
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [carritos_service_1.CarritosService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map