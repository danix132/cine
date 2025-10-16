"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.FuncionesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var public_decorator_1 = require("../common/decorators/public.decorator");
var client_1 = require("@prisma/client");
var FuncionesController = /** @class */ (function () {
    function FuncionesController(funcionesService) {
        this.funcionesService = funcionesService;
    }
    FuncionesController.prototype.debugConflictos = function (createFuncionDto) {
        return this.funcionesService.debugConflictos(createFuncionDto);
    };
    FuncionesController.prototype.create = function (createFuncionDto) {
        return this.funcionesService.create(createFuncionDto);
    };
    FuncionesController.prototype.findAll = function (paginationDto) {
        return this.funcionesService.findAll(paginationDto);
    };
    FuncionesController.prototype.findUpcoming = function () {
        return this.funcionesService.findUpcoming();
    };
    FuncionesController.prototype.findDisponibles = function () {
        return this.funcionesService.findUpcoming(); // Reutilizar el mismo método
    };
    FuncionesController.prototype.findByPelicula = function (peliculaId) {
        return this.funcionesService.findByPelicula(peliculaId);
    };
    FuncionesController.prototype.findBySala = function (salaId) {
        return this.funcionesService.findBySala(salaId);
    };
    FuncionesController.prototype.findOne = function (id) {
        return this.funcionesService.findOne(id);
    };
    FuncionesController.prototype.update = function (id, updateFuncionDto) {
        return this.funcionesService.update(id, updateFuncionDto);
    };
    FuncionesController.prototype.cancelar = function (id) {
        return this.funcionesService.cancelar(id);
    };
    FuncionesController.prototype.reactivar = function (id) {
        return this.funcionesService.reactivar(id);
    };
    FuncionesController.prototype.remove = function (id) {
        return this.funcionesService.remove(id);
    };
    __decorate([
        common_1.Post('debug'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Debug: Analizar conflictos sin crear función' }),
        __param(0, common_1.Body())
    ], FuncionesController.prototype, "debugConflictos");
    __decorate([
        common_1.Post(),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Crear nueva función (solo admin)' }),
        swagger_1.ApiResponse({ status: 201, description: 'Función creada exitosamente' }),
        swagger_1.ApiResponse({ status: 409, description: 'Conflicto de horario' }),
        __param(0, common_1.Body())
    ], FuncionesController.prototype, "create");
    __decorate([
        common_1.Get(),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener todas las funciones (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Lista de funciones' }),
        __param(0, common_1.Query())
    ], FuncionesController.prototype, "findAll");
    __decorate([
        common_1.Get('proximas'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener funciones próximas (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Funciones próximas' })
    ], FuncionesController.prototype, "findUpcoming");
    __decorate([
        common_1.Get('disponibles'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener funciones disponibles para venta (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Funciones disponibles' })
    ], FuncionesController.prototype, "findDisponibles");
    __decorate([
        common_1.Get('pelicula/:peliculaId'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Buscar funciones por película (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Funciones de la película' }),
        __param(0, common_1.Param('peliculaId'))
    ], FuncionesController.prototype, "findByPelicula");
    __decorate([
        common_1.Get('sala/:salaId'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Buscar funciones por sala (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Funciones de la sala' }),
        __param(0, common_1.Param('salaId'))
    ], FuncionesController.prototype, "findBySala");
    __decorate([
        common_1.Get(':id'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener función por ID (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Función encontrada' }),
        swagger_1.ApiResponse({ status: 404, description: 'Función no encontrada' }),
        __param(0, common_1.Param('id'))
    ], FuncionesController.prototype, "findOne");
    __decorate([
        common_1.Patch(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Actualizar función (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Función actualizada' }),
        swagger_1.ApiResponse({ status: 404, description: 'Función no encontrada' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], FuncionesController.prototype, "update");
    __decorate([
        common_1.Post(':id/cancelar'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Cancelar función (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Función cancelada' }),
        swagger_1.ApiResponse({ status: 400, description: 'No se puede cancelar' }),
        __param(0, common_1.Param('id'))
    ], FuncionesController.prototype, "cancelar");
    __decorate([
        common_1.Post(':id/reactivar'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Reactivar función cancelada (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Función reactivada' }),
        swagger_1.ApiResponse({ status: 400, description: 'No se puede reactivar' }),
        swagger_1.ApiResponse({ status: 409, description: 'Conflicto de horario al reactivar' }),
        __param(0, common_1.Param('id'))
    ], FuncionesController.prototype, "reactivar");
    __decorate([
        common_1.Delete(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Eliminar función (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Función eliminada' }),
        swagger_1.ApiResponse({ status: 400, description: 'No se puede eliminar' }),
        __param(0, common_1.Param('id'))
    ], FuncionesController.prototype, "remove");
    FuncionesController = __decorate([
        swagger_1.ApiTags('funciones'),
        common_1.Controller('funciones')
    ], FuncionesController);
    return FuncionesController;
}());
exports.FuncionesController = FuncionesController;
