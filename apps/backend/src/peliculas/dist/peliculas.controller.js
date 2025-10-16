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
exports.PeliculasController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var public_decorator_1 = require("../common/decorators/public.decorator");
var client_1 = require("@prisma/client");
var PeliculasController = /** @class */ (function () {
    function PeliculasController(peliculasService) {
        this.peliculasService = peliculasService;
    }
    PeliculasController.prototype.create = function (createPeliculaDto) {
        return this.peliculasService.create(createPeliculaDto);
    };
    PeliculasController.prototype.findAll = function (paginationDto) {
        return this.peliculasService.findAll(paginationDto);
    };
    PeliculasController.prototype.findActive = function () {
        return this.peliculasService.findActive();
    };
    PeliculasController.prototype.findByGenero = function (genero) {
        return this.peliculasService.findByGenero(genero);
    };
    PeliculasController.prototype.findOne = function (id) {
        return this.peliculasService.findOne(id);
    };
    PeliculasController.prototype.update = function (id, updatePeliculaDto) {
        return this.peliculasService.update(id, updatePeliculaDto);
    };
    PeliculasController.prototype.remove = function (id) {
        return this.peliculasService.remove(id);
    };
    PeliculasController.prototype.forceRemove = function (id) {
        return this.peliculasService.forceRemove(id);
    };
    __decorate([
        common_1.Post(),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Crear nueva película (solo admin)' }),
        swagger_1.ApiResponse({ status: 201, description: 'Película creada exitosamente' }),
        __param(0, common_1.Body())
    ], PeliculasController.prototype, "create");
    __decorate([
        common_1.Get(),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener todas las películas (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Lista de películas' }),
        __param(0, common_1.Query())
    ], PeliculasController.prototype, "findAll");
    __decorate([
        common_1.Get('activas'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener películas activas con funciones (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Películas activas' })
    ], PeliculasController.prototype, "findActive");
    __decorate([
        common_1.Get('genero/:genero'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Buscar películas por género (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Películas del género' }),
        __param(0, common_1.Param('genero'))
    ], PeliculasController.prototype, "findByGenero");
    __decorate([
        common_1.Get(':id'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener película por ID con funciones (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Película encontrada' }),
        swagger_1.ApiResponse({ status: 404, description: 'Película no encontrada' }),
        __param(0, common_1.Param('id'))
    ], PeliculasController.prototype, "findOne");
    __decorate([
        common_1.Patch(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Actualizar película (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Película actualizada' }),
        swagger_1.ApiResponse({ status: 404, description: 'Película no encontrada' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], PeliculasController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Eliminar película (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Película eliminada' }),
        swagger_1.ApiResponse({ status: 404, description: 'Película no encontrada' }),
        __param(0, common_1.Param('id'))
    ], PeliculasController.prototype, "remove");
    __decorate([
        common_1.Delete(':id/forzar'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Forzar eliminación completa de película (solo admin) - CUIDADO: Elimina todo incluidos boletos' }),
        swagger_1.ApiResponse({ status: 200, description: 'Película forzadamente eliminada' }),
        swagger_1.ApiResponse({ status: 404, description: 'Película no encontrada' }),
        __param(0, common_1.Param('id'))
    ], PeliculasController.prototype, "forceRemove");
    PeliculasController = __decorate([
        swagger_1.ApiTags('peliculas'),
        common_1.Controller('peliculas')
    ], PeliculasController);
    return PeliculasController;
}());
exports.PeliculasController = PeliculasController;
