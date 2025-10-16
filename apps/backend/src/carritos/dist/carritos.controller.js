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
exports.CarritosController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var client_1 = require("@prisma/client");
var CarritosController = /** @class */ (function () {
    function CarritosController(carritosService) {
        this.carritosService = carritosService;
    }
    CarritosController.prototype.create = function (createCarritoDto, req) {
        var user = req.user;
        var userId = user.rol === 'CLIENTE' ? user.id : undefined;
        var vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.create(createCarritoDto, userId, vendedorId);
    };
    CarritosController.prototype.findAll = function (paginationDto) {
        return this.carritosService.findAll(paginationDto);
    };
    CarritosController.prototype.getMyCarrito = function (req) {
        var user = req.user;
        if (user.rol === 'CLIENTE') {
            return this.carritosService.getCarritoByUser(user.id);
        }
        else if (user.rol === 'VENDEDOR') {
            return this.carritosService.getCarritoByVendedor(user.id);
        }
        throw new Error('Rol no válido para obtener carrito');
    };
    CarritosController.prototype.findOne = function (id, req) {
        var user = req.user;
        var userId = user.rol === 'CLIENTE' ? user.id : undefined;
        var vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.findOne(id, userId, vendedorId);
    };
    CarritosController.prototype.addItem = function (id, addItemDto, req) {
        var user = req.user;
        var userId = user.rol === 'CLIENTE' ? user.id : undefined;
        var vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.addItem(id, addItemDto, userId, vendedorId);
    };
    CarritosController.prototype.updateItem = function (id, itemId, updateItemDto, req) {
        var user = req.user;
        var userId = user.rol === 'CLIENTE' ? user.id : undefined;
        var vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.updateItem(id, itemId, updateItemDto, userId, vendedorId);
    };
    CarritosController.prototype.removeItem = function (id, itemId, req) {
        var user = req.user;
        var userId = user.rol === 'CLIENTE' ? user.id : undefined;
        var vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.removeItem(id, itemId, userId, vendedorId);
    };
    CarritosController.prototype.remove = function (id, req) {
        var user = req.user;
        var userId = user.rol === 'CLIENTE' ? user.id : undefined;
        var vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.remove(id, userId, vendedorId);
    };
    CarritosController.prototype.calcularTotal = function (id, req) {
        var user = req.user;
        var userId = user.rol === 'CLIENTE' ? user.id : undefined;
        var vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.calcularTotal(id);
    };
    __decorate([
        common_1.Post(),
        swagger_1.ApiOperation({ summary: 'Crear nuevo carrito' }),
        swagger_1.ApiResponse({ status: 201, description: 'Carrito creado exitosamente' }),
        __param(0, common_1.Body()), __param(1, common_1.Request())
    ], CarritosController.prototype, "create");
    __decorate([
        common_1.Get(),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Obtener todos los carritos (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Lista de carritos' }),
        __param(0, common_1.Query())
    ], CarritosController.prototype, "findAll");
    __decorate([
        common_1.Get('mi-carrito'),
        swagger_1.ApiOperation({ summary: 'Obtener carrito del usuario autenticado' }),
        swagger_1.ApiResponse({ status: 200, description: 'Carrito encontrado' }),
        swagger_1.ApiResponse({ status: 404, description: 'Carrito no encontrado' }),
        __param(0, common_1.Request())
    ], CarritosController.prototype, "getMyCarrito");
    __decorate([
        common_1.Get(':id'),
        swagger_1.ApiOperation({ summary: 'Obtener carrito por ID' }),
        swagger_1.ApiResponse({ status: 200, description: 'Carrito encontrado' }),
        swagger_1.ApiResponse({ status: 404, description: 'Carrito no encontrado' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Request())
    ], CarritosController.prototype, "findOne");
    __decorate([
        common_1.Post(':id/items'),
        swagger_1.ApiOperation({ summary: 'Agregar item al carrito' }),
        swagger_1.ApiResponse({ status: 201, description: 'Item agregado exitosamente' }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __param(2, common_1.Request())
    ], CarritosController.prototype, "addItem");
    __decorate([
        common_1.Patch(':id/items/:itemId'),
        swagger_1.ApiOperation({ summary: 'Actualizar item del carrito' }),
        swagger_1.ApiResponse({ status: 200, description: 'Item actualizado' }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Param('itemId')),
        __param(2, common_1.Body()),
        __param(3, common_1.Request())
    ], CarritosController.prototype, "updateItem");
    __decorate([
        common_1.Delete(':id/items/:itemId'),
        swagger_1.ApiOperation({ summary: 'Eliminar item del carrito' }),
        swagger_1.ApiResponse({ status: 200, description: 'Item eliminado' }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Param('itemId')),
        __param(2, common_1.Request())
    ], CarritosController.prototype, "removeItem");
    __decorate([
        common_1.Delete(':id'),
        swagger_1.ApiOperation({ summary: 'Eliminar carrito' }),
        swagger_1.ApiResponse({ status: 200, description: 'Carrito eliminado' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Request())
    ], CarritosController.prototype, "remove");
    __decorate([
        common_1.Get(':id/total'),
        swagger_1.ApiOperation({ summary: 'Calcular total del carrito' }),
        swagger_1.ApiResponse({ status: 200, description: 'Total calculado' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Request())
    ], CarritosController.prototype, "calcularTotal");
    CarritosController = __decorate([
        swagger_1.ApiTags('carritos'),
        common_1.Controller('carritos'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        swagger_1.ApiBearerAuth()
    ], CarritosController);
    return CarritosController;
}());
exports.CarritosController = CarritosController;
