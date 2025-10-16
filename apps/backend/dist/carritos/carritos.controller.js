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
exports.CarritosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const carritos_service_1 = require("./carritos.service");
const create_carrito_dto_1 = require("./dto/create-carrito.dto");
const add_item_dto_1 = require("./dto/add-item.dto");
const update_item_dto_1 = require("./dto/update-item.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let CarritosController = class CarritosController {
    constructor(carritosService) {
        this.carritosService = carritosService;
    }
    create(createCarritoDto, req) {
        const { user } = req;
        const userId = user.rol === 'CLIENTE' ? user.id : undefined;
        const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.create(createCarritoDto, userId, vendedorId);
    }
    findAll(paginationDto) {
        return this.carritosService.findAll(paginationDto);
    }
    getMyCarrito(req) {
        const { user } = req;
        if (user.rol === 'CLIENTE') {
            return this.carritosService.getCarritoByUser(user.id);
        }
        else if (user.rol === 'VENDEDOR') {
            return this.carritosService.getCarritoByVendedor(user.id);
        }
        throw new Error('Rol no válido para obtener carrito');
    }
    findOne(id, req) {
        const { user } = req;
        const userId = user.rol === 'CLIENTE' ? user.id : undefined;
        const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.findOne(id, userId, vendedorId);
    }
    addItem(id, addItemDto, req) {
        const { user } = req;
        const userId = user.rol === 'CLIENTE' ? user.id : undefined;
        const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.addItem(id, addItemDto, userId, vendedorId);
    }
    updateItem(id, itemId, updateItemDto, req) {
        const { user } = req;
        const userId = user.rol === 'CLIENTE' ? user.id : undefined;
        const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.updateItem(id, itemId, updateItemDto, userId, vendedorId);
    }
    removeItem(id, itemId, req) {
        const { user } = req;
        const userId = user.rol === 'CLIENTE' ? user.id : undefined;
        const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.removeItem(id, itemId, userId, vendedorId);
    }
    remove(id, req) {
        const { user } = req;
        const userId = user.rol === 'CLIENTE' ? user.id : undefined;
        const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.remove(id, userId, vendedorId);
    }
    calcularTotal(id, req) {
        const { user } = req;
        const userId = user.rol === 'CLIENTE' ? user.id : undefined;
        const vendedorId = user.rol === 'VENDEDOR' ? user.id : undefined;
        return this.carritosService.calcularTotal(id);
    }
};
exports.CarritosController = CarritosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo carrito' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Carrito creado exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_carrito_dto_1.CreateCarritoDto, Object]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los carritos (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de carritos' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mi-carrito'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener carrito del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Carrito encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Carrito no encontrado' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "getMyCarrito", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener carrito por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Carrito encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Carrito no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar item al carrito' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item agregado exitosamente' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_item_dto_1.AddItemDto, Object]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)(':id/items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar item del carrito' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item actualizado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_item_dto_1.UpdateItemDto, Object]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':id/items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar item del carrito' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item eliminado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar carrito' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Carrito eliminado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/total'),
    (0, swagger_1.ApiOperation)({ summary: 'Calcular total del carrito' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Total calculado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "calcularTotal", null);
exports.CarritosController = CarritosController = __decorate([
    (0, swagger_1.ApiTags)('carritos'),
    (0, common_1.Controller)('carritos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [carritos_service_1.CarritosService])
], CarritosController);
//# sourceMappingURL=carritos.controller.js.map