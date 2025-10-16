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
exports.PedidosController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var PedidosController = /** @class */ (function () {
    function PedidosController(pedidosService) {
        this.pedidosService = pedidosService;
    }
    PedidosController.prototype.create = function (createPedidoDto) {
        return this.pedidosService.create(createPedidoDto);
    };
    PedidosController.prototype.findAll = function (query) {
        return this.pedidosService.findAll(query);
    };
    PedidosController.prototype.findMyOrders = function (usuarioId) {
        return this.pedidosService.findMyOrders(usuarioId);
    };
    PedidosController.prototype.findOne = function (id) {
        return this.pedidosService.findOne(id);
    };
    PedidosController.prototype.update = function (id, updatePedidoDto) {
        return this.pedidosService.update(id, updatePedidoDto);
    };
    PedidosController.prototype.remove = function (id) {
        return this.pedidosService.remove(id);
    };
    __decorate([
        common_1.Post(),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR', 'CLIENTE'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Crear un nuevo pedido' }),
        __param(0, common_1.Body())
    ], PedidosController.prototype, "create");
    __decorate([
        common_1.Get(),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Obtener todos los pedidos' }),
        __param(0, common_1.Query())
    ], PedidosController.prototype, "findAll");
    __decorate([
        common_1.Get('mios'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('CLIENTE'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Obtener mis pedidos (cliente)' }),
        __param(0, common_1.Query('usuarioId'))
    ], PedidosController.prototype, "findMyOrders");
    __decorate([
        common_1.Get(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR', 'CLIENTE'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Obtener un pedido por ID' }),
        __param(0, common_1.Param('id'))
    ], PedidosController.prototype, "findOne");
    __decorate([
        common_1.Patch(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Actualizar un pedido' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], PedidosController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Eliminar un pedido' }),
        __param(0, common_1.Param('id'))
    ], PedidosController.prototype, "remove");
    PedidosController = __decorate([
        swagger_1.ApiTags('pedidos'),
        common_1.Controller('pedidos')
    ], PedidosController);
    return PedidosController;
}());
exports.PedidosController = PedidosController;
