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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.DulceriaController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var public_decorator_1 = require("../common/decorators/public.decorator");
var client_1 = require("@prisma/client");
var DulceriaController = /** @class */ (function () {
    function DulceriaController(dulceriaService) {
        this.dulceriaService = dulceriaService;
    }
    DulceriaController.prototype.create = function (createDulceriaItemDto) {
        return this.dulceriaService.create(createDulceriaItemDto);
    };
    DulceriaController.prototype.findAll = function (paginationDto) {
        return this.dulceriaService.findAll(paginationDto);
    };
    DulceriaController.prototype.findActive = function () {
        return this.dulceriaService.findActive();
    };
    DulceriaController.prototype.findByTipo = function (tipo) {
        return this.dulceriaService.findByTipo(tipo);
    };
    DulceriaController.prototype.obtenerInventario = function () {
        return this.dulceriaService.obtenerInventario();
    };
    DulceriaController.prototype.procesarVenta = function (procesarVentaDulceriaDto, req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('🍿 CONTROLLER: Procesando venta de dulcería');
                console.log('📦 Items recibidos:', procesarVentaDulceriaDto.items);
                console.log('👤 Usuario:', req.user);
                return [2 /*return*/, this.dulceriaService.procesarVenta(procesarVentaDulceriaDto, req.user.id)];
            });
        });
    };
    DulceriaController.prototype.findOne = function (id) {
        return this.dulceriaService.findOne(id);
    };
    DulceriaController.prototype.update = function (id, updateDulceriaItemDto) {
        return this.dulceriaService.update(id, updateDulceriaItemDto);
    };
    DulceriaController.prototype.activar = function (id) {
        return this.dulceriaService.activar(id);
    };
    DulceriaController.prototype.remove = function (id) {
        return this.dulceriaService.remove(id);
    };
    __decorate([
        common_1.Post(),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Crear nuevo item de dulcería (solo admin)' }),
        swagger_1.ApiResponse({ status: 201, description: 'Item creado exitosamente' }),
        __param(0, common_1.Body())
    ], DulceriaController.prototype, "create");
    __decorate([
        common_1.Get(),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener todos los items de dulcería (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Lista de items' }),
        __param(0, common_1.Query())
    ], DulceriaController.prototype, "findAll");
    __decorate([
        common_1.Get('activos'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener items activos de dulcería (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Items activos' })
    ], DulceriaController.prototype, "findActive");
    __decorate([
        common_1.Get('tipo/:tipo'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Buscar items por tipo (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Items del tipo' }),
        __param(0, common_1.Param('tipo'))
    ], DulceriaController.prototype, "findByTipo");
    __decorate([
        common_1.Get('inventario'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN, client_1.UserRole.VENDEDOR),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Obtener inventario (admin/vendedor)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Inventario obtenido' })
    ], DulceriaController.prototype, "obtenerInventario");
    __decorate([
        common_1.Post('venta'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.VENDEDOR, client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Procesar venta de dulcería (vendedor/admin)' }),
        swagger_1.ApiResponse({ status: 201, description: 'Venta procesada exitosamente' }),
        swagger_1.ApiResponse({ status: 400, description: 'Datos inválidos' }),
        __param(0, common_1.Body()),
        __param(1, common_1.Request())
    ], DulceriaController.prototype, "procesarVenta");
    __decorate([
        common_1.Get(':id'),
        public_decorator_1.Public(),
        swagger_1.ApiOperation({ summary: 'Obtener item por ID (público)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Item encontrado' }),
        swagger_1.ApiResponse({ status: 404, description: 'Item no encontrado' }),
        __param(0, common_1.Param('id'))
    ], DulceriaController.prototype, "findOne");
    __decorate([
        common_1.Patch(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Actualizar item (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Item actualizado' }),
        swagger_1.ApiResponse({ status: 404, description: 'Item no encontrado' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], DulceriaController.prototype, "update");
    __decorate([
        common_1.Patch(':id/activar'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Activar item (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Item activado' }),
        __param(0, common_1.Param('id'))
    ], DulceriaController.prototype, "activar");
    __decorate([
        common_1.Delete(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Desactivar item (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Item desactivado' }),
        __param(0, common_1.Param('id'))
    ], DulceriaController.prototype, "remove");
    DulceriaController = __decorate([
        swagger_1.ApiTags('dulceria'),
        common_1.Controller('dulceria')
    ], DulceriaController);
    return DulceriaController;
}());
exports.DulceriaController = DulceriaController;
