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
exports.DulceriaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dulceria_service_1 = require("./dulceria.service");
const create_dulceria_item_dto_1 = require("./dto/create-dulceria-item.dto");
const update_dulceria_item_dto_1 = require("./dto/update-dulceria-item.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const client_1 = require("@prisma/client");
let DulceriaController = class DulceriaController {
    constructor(dulceriaService) {
        this.dulceriaService = dulceriaService;
    }
    create(createDulceriaItemDto) {
        return this.dulceriaService.create(createDulceriaItemDto);
    }
    findAll(paginationDto) {
        return this.dulceriaService.findAll(paginationDto);
    }
    findActive() {
        return this.dulceriaService.findActive();
    }
    findByTipo(tipo) {
        return this.dulceriaService.findByTipo(tipo);
    }
    obtenerInventario() {
        return this.dulceriaService.obtenerInventario();
    }
    async procesarVenta(procesarVentaDulceriaDto, req) {
        console.log('🍿 CONTROLLER: Procesando venta de dulcería');
        console.log('📦 Items recibidos:', procesarVentaDulceriaDto.items);
        console.log('👤 Usuario:', req.user);
        return this.dulceriaService.procesarVenta(procesarVentaDulceriaDto, req.user.id);
    }
    findOne(id) {
        return this.dulceriaService.findOne(id);
    }
    update(id, updateDulceriaItemDto) {
        return this.dulceriaService.update(id, updateDulceriaItemDto);
    }
    activar(id) {
        return this.dulceriaService.activar(id);
    }
    remove(id) {
        return this.dulceriaService.remove(id);
    }
};
exports.DulceriaController = DulceriaController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo item de dulcería (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item creado exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dulceria_item_dto_1.CreateDulceriaItemDto]),
    __metadata("design:returntype", void 0)
], DulceriaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los items de dulcería (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de items' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], DulceriaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('activos'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener items activos de dulcería (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Items activos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DulceriaController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('tipo/:tipo'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar items por tipo (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Items del tipo' }),
    __param(0, (0, common_1.Param)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DulceriaController.prototype, "findByTipo", null);
__decorate([
    (0, common_1.Get)('inventario'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.VENDEDOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener inventario (admin/vendedor)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventario obtenido' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DulceriaController.prototype, "obtenerInventario", null);
__decorate([
    (0, common_1.Post)('venta'),
    (0, common_1.Post)('venta'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CLIENTE, client_1.UserRole.VENDEDOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Procesar venta de dulcería (clientes, vendedor/admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Venta procesada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DulceriaController.prototype, "procesarVenta", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener item por ID (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DulceriaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar item (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item actualizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dulceria_item_dto_1.UpdateDulceriaItemDto]),
    __metadata("design:returntype", void 0)
], DulceriaController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/activar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Activar item (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item activado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DulceriaController.prototype, "activar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar item (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item desactivado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DulceriaController.prototype, "remove", null);
exports.DulceriaController = DulceriaController = __decorate([
    (0, swagger_1.ApiTags)('dulceria'),
    (0, common_1.Controller)('dulceria'),
    __metadata("design:paramtypes", [dulceria_service_1.DulceriaService])
], DulceriaController);
//# sourceMappingURL=dulceria.controller.js.map