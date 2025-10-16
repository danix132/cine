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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const salas_service_1 = require("./salas.service");
const create_sala_dto_1 = require("./dto/create-sala.dto");
const update_sala_dto_1 = require("./dto/update-sala.dto");
const update_asientos_danados_dto_1 = require("./dto/update-asientos-danados.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SalasController = class SalasController {
    constructor(salasService) {
        this.salasService = salasService;
    }
    create(createSalaDto) {
        return this.salasService.create(createSalaDto);
    }
    findAll(paginationDto) {
        return this.salasService.findAll(paginationDto);
    }
    findOne(id) {
        return this.salasService.findOne(id);
    }
    async update(id, updateSalaDto) {
        console.log('🎯 Controller update - ID:', id);
        console.log('🎯 Controller update - DTO:', updateSalaDto);
        console.log('🎯 Controller update - DTO tipos:', {
            nombre: typeof updateSalaDto.nombre,
            filas: typeof updateSalaDto.filas,
            asientosPorFila: typeof updateSalaDto.asientosPorFila
        });
        try {
            const result = await this.salasService.update(id, updateSalaDto);
            console.log('🎯 Controller update - Resultado exitoso');
            return result;
        }
        catch (error) {
            console.error('🎯 Controller update - Error:', error);
            throw error;
        }
    }
    remove(id) {
        return this.salasService.remove(id);
    }
    updateAsientosDanados(id, updateAsientosDanadosDto) {
        return this.salasService.updateAsientosDanados(id, updateAsientosDanadosDto);
    }
    getAsientosDisponibilidad(id, funcionId) {
        return this.salasService.getAsientosDisponibilidad(id, funcionId);
    }
};
exports.SalasController = SalasController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva sala (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sala creada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sala_dto_1.CreateSalaDto]),
    __metadata("design:returntype", void 0)
], SalasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.VENDEDOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las salas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de salas' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], SalasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener sala por ID con asientos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sala encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Sala no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar sala (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sala actualizada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Sala no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sala_dto_1.UpdateSalaDto]),
    __metadata("design:returntype", Promise)
], SalasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar sala (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sala eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Sala no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalasController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/asientos-danados'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar asientos dañados (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asientos dañados actualizados' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_asientos_danados_dto_1.UpdateAsientosDanadosDto]),
    __metadata("design:returntype", void 0)
], SalasController.prototype, "updateAsientosDanados", null);
__decorate([
    (0, common_1.Get)(':id/asientos/:funcionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener disponibilidad de asientos para una función' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Disponibilidad de asientos' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('funcionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalasController.prototype, "getAsientosDisponibilidad", null);
exports.SalasController = SalasController = __decorate([
    (0, swagger_1.ApiTags)('salas'),
    (0, common_1.Controller)('salas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [salas_service_1.SalasService])
], SalasController);
//# sourceMappingURL=salas.controller.js.map