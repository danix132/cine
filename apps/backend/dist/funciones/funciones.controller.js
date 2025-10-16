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
exports.FuncionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const funciones_service_1 = require("./funciones.service");
const create_funcion_dto_1 = require("./dto/create-funcion.dto");
const update_funcion_dto_1 = require("./dto/update-funcion.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const client_1 = require("@prisma/client");
let FuncionesController = class FuncionesController {
    constructor(funcionesService) {
        this.funcionesService = funcionesService;
    }
    debugConflictos(createFuncionDto) {
        return this.funcionesService.debugConflictos(createFuncionDto);
    }
    create(createFuncionDto) {
        return this.funcionesService.create(createFuncionDto);
    }
    findAll(paginationDto) {
        return this.funcionesService.findAll(paginationDto);
    }
    findUpcoming() {
        return this.funcionesService.findUpcoming();
    }
    findDisponibles() {
        return this.funcionesService.findUpcoming();
    }
    findByPelicula(peliculaId) {
        return this.funcionesService.findByPelicula(peliculaId);
    }
    findBySala(salaId) {
        return this.funcionesService.findBySala(salaId);
    }
    findOne(id) {
        return this.funcionesService.findOne(id);
    }
    update(id, updateFuncionDto) {
        return this.funcionesService.update(id, updateFuncionDto);
    }
    cancelar(id) {
        return this.funcionesService.cancelar(id);
    }
    reactivar(id) {
        return this.funcionesService.reactivar(id);
    }
    remove(id) {
        return this.funcionesService.remove(id);
    }
};
exports.FuncionesController = FuncionesController;
__decorate([
    (0, common_1.Post)('debug'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Debug: Analizar conflictos sin crear función' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_funcion_dto_1.CreateFuncionDto]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "debugConflictos", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva función (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Función creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflicto de horario' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_funcion_dto_1.CreateFuncionDto]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las funciones (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de funciones' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('proximas'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener funciones próximas (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Funciones próximas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "findUpcoming", null);
__decorate([
    (0, common_1.Get)('disponibles'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener funciones disponibles para venta (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Funciones disponibles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "findDisponibles", null);
__decorate([
    (0, common_1.Get)('pelicula/:peliculaId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar funciones por película (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Funciones de la película' }),
    __param(0, (0, common_1.Param)('peliculaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "findByPelicula", null);
__decorate([
    (0, common_1.Get)('sala/:salaId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar funciones por sala (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Funciones de la sala' }),
    __param(0, (0, common_1.Param)('salaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "findBySala", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener función por ID (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Función encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Función no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar función (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Función actualizada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Función no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_funcion_dto_1.UpdateFuncionDto]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/cancelar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar función (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Función cancelada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No se puede cancelar' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "cancelar", null);
__decorate([
    (0, common_1.Post)(':id/reactivar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivar función cancelada (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Función reactivada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No se puede reactivar' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflicto de horario al reactivar' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "reactivar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar función (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Función eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No se puede eliminar' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuncionesController.prototype, "remove", null);
exports.FuncionesController = FuncionesController = __decorate([
    (0, swagger_1.ApiTags)('funciones'),
    (0, common_1.Controller)('funciones'),
    __metadata("design:paramtypes", [funciones_service_1.FuncionesService])
], FuncionesController);
//# sourceMappingURL=funciones.controller.js.map