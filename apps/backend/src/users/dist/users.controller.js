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
exports.UsersController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var client_1 = require("@prisma/client");
var UsersController = /** @class */ (function () {
    function UsersController(usersService) {
        this.usersService = usersService;
    }
    UsersController.prototype.create = function (createUserDto) {
        return this.usersService.create(createUserDto);
    };
    UsersController.prototype.findAll = function (query) {
        return this.usersService.findAll(query);
    };
    UsersController.prototype.findOne = function (id) {
        return this.usersService.findOne(id);
    };
    UsersController.prototype.update = function (id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    };
    UsersController.prototype.remove = function (id) {
        return this.usersService.remove(id);
    };
    __decorate([
        common_1.Post(),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Crear nuevo usuario (solo admin)' }),
        swagger_1.ApiResponse({ status: 201, description: 'Usuario creado exitosamente' }),
        swagger_1.ApiResponse({ status: 409, description: 'Email ya registrado' }),
        __param(0, common_1.Body())
    ], UsersController.prototype, "create");
    __decorate([
        common_1.Get(),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Obtener todos los usuarios (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Lista de usuarios' }),
        __param(0, common_1.Query())
    ], UsersController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Obtener usuario por ID (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Usuario encontrado' }),
        swagger_1.ApiResponse({ status: 404, description: 'Usuario no encontrado' }),
        __param(0, common_1.Param('id'))
    ], UsersController.prototype, "findOne");
    __decorate([
        common_1.Patch(':id'),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Actualizar usuario (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Usuario actualizado' }),
        swagger_1.ApiResponse({ status: 404, description: 'Usuario no encontrado' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], UsersController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Eliminar usuario (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Usuario eliminado' }),
        swagger_1.ApiResponse({ status: 404, description: 'Usuario no encontrado' }),
        __param(0, common_1.Param('id'))
    ], UsersController.prototype, "remove");
    UsersController = __decorate([
        swagger_1.ApiTags('users'),
        common_1.Controller('users'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        swagger_1.ApiBearerAuth()
    ], UsersController);
    return UsersController;
}());
exports.UsersController = UsersController;
