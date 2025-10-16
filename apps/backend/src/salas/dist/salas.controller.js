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
exports.SalasController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var client_1 = require("@prisma/client");
var SalasController = /** @class */ (function () {
    function SalasController(salasService) {
        this.salasService = salasService;
    }
    SalasController.prototype.create = function (createSalaDto) {
        return this.salasService.create(createSalaDto);
    };
    SalasController.prototype.findAll = function (paginationDto) {
        return this.salasService.findAll(paginationDto);
    };
    SalasController.prototype.findOne = function (id) {
        return this.salasService.findOne(id);
    };
    SalasController.prototype.update = function (id, updateSalaDto) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🎯 Controller update - ID:', id);
                        console.log('🎯 Controller update - DTO:', updateSalaDto);
                        console.log('🎯 Controller update - DTO tipos:', {
                            nombre: typeof updateSalaDto.nombre,
                            filas: typeof updateSalaDto.filas,
                            asientosPorFila: typeof updateSalaDto.asientosPorFila
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.salasService.update(id, updateSalaDto)];
                    case 2:
                        result = _a.sent();
                        console.log('🎯 Controller update - Resultado exitoso');
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        console.error('🎯 Controller update - Error:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SalasController.prototype.remove = function (id) {
        return this.salasService.remove(id);
    };
    SalasController.prototype.updateAsientosDanados = function (id, updateAsientosDanadosDto) {
        return this.salasService.updateAsientosDanados(id, updateAsientosDanadosDto);
    };
    SalasController.prototype.getAsientosDisponibilidad = function (id, funcionId) {
        return this.salasService.getAsientosDisponibilidad(id, funcionId);
    };
    __decorate([
        common_1.Post(),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Crear nueva sala (solo admin)' }),
        swagger_1.ApiResponse({ status: 201, description: 'Sala creada exitosamente' }),
        __param(0, common_1.Body())
    ], SalasController.prototype, "create");
    __decorate([
        common_1.Get(),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN, client_1.UserRole.VENDEDOR) // Permitir también vendedores
        ,
        swagger_1.ApiOperation({ summary: 'Obtener todas las salas' }),
        swagger_1.ApiResponse({ status: 200, description: 'Lista de salas' }),
        __param(0, common_1.Query())
    ], SalasController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        swagger_1.ApiOperation({ summary: 'Obtener sala por ID con asientos' }),
        swagger_1.ApiResponse({ status: 200, description: 'Sala encontrada' }),
        swagger_1.ApiResponse({ status: 404, description: 'Sala no encontrada' }),
        __param(0, common_1.Param('id'))
    ], SalasController.prototype, "findOne");
    __decorate([
        common_1.Patch(':id'),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Actualizar sala (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Sala actualizada' }),
        swagger_1.ApiResponse({ status: 404, description: 'Sala no encontrada' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], SalasController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Eliminar sala (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Sala eliminada' }),
        swagger_1.ApiResponse({ status: 404, description: 'Sala no encontrada' }),
        __param(0, common_1.Param('id'))
    ], SalasController.prototype, "remove");
    __decorate([
        common_1.Patch(':id/asientos-danados'),
        roles_decorator_1.Roles(client_1.UserRole.ADMIN),
        swagger_1.ApiOperation({ summary: 'Actualizar asientos dañados (solo admin)' }),
        swagger_1.ApiResponse({ status: 200, description: 'Asientos dañados actualizados' }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body())
    ], SalasController.prototype, "updateAsientosDanados");
    __decorate([
        common_1.Get(':id/asientos/:funcionId'),
        swagger_1.ApiOperation({ summary: 'Obtener disponibilidad de asientos para una función' }),
        swagger_1.ApiResponse({ status: 200, description: 'Disponibilidad de asientos' }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Param('funcionId'))
    ], SalasController.prototype, "getAsientosDisponibilidad");
    SalasController = __decorate([
        swagger_1.ApiTags('salas'),
        common_1.Controller('salas'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        swagger_1.ApiBearerAuth()
    ], SalasController);
    return SalasController;
}());
exports.SalasController = SalasController;
