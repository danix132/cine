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
exports.BoletosController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var BoletosController = /** @class */ (function () {
    function BoletosController(boletosService) {
        this.boletosService = boletosService;
    }
    BoletosController.prototype.create = function (createBoletoDto) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🎯 CONTROLLER: POST /boletos llamado con:', JSON.stringify(createBoletoDto, null, 2));
                        console.log('🔍 CONTROLLER: Tipo de datos recibidos:', {
                            funcionId: typeof createBoletoDto.funcionId,
                            asientoId: typeof createBoletoDto.asientoId,
                            usuarioId: typeof createBoletoDto.usuarioId,
                            estado: typeof createBoletoDto.estado
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.boletosService.create(createBoletoDto)];
                    case 2:
                        result = _a.sent();
                        console.log('✅ CONTROLLER: Boleto creado exitosamente:', result.id);
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ CONTROLLER: Error al crear boleto:', error_1.message);
                        console.error('❌ CONTROLLER: Stack trace:', error_1.stack);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BoletosController.prototype.findAll = function () {
        return this.boletosService.findAll();
    };
    BoletosController.prototype.findOne = function (id) {
        return this.boletosService.findOne(id);
    };
    BoletosController.prototype.update = function (id, updateBoletoDto) {
        return this.boletosService.update(id, updateBoletoDto);
    };
    BoletosController.prototype.remove = function (id) {
        return this.boletosService.remove(id);
    };
    BoletosController.prototype.getBoletosPorFuncion = function (funcionId) {
        console.log('🎯 CONTROLLER: GET /boletos/funcion/' + funcionId);
        return this.boletosService.getBoletosPorFuncion(funcionId);
    };
    BoletosController.prototype.verificarQR = function (body) {
        return this.boletosService.verificarQR(body.codigoQR);
    };
    BoletosController.prototype.validarBoleto = function (codigoQR) {
        console.log('🎫 CONTROLLER: Validando boleto con QR:', codigoQR);
        return this.boletosService.validarBoleto(codigoQR);
    };
    __decorate([
        common_1.Post(),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Crear un nuevo boleto' }),
        __param(0, common_1.Body())
    ], BoletosController.prototype, "create");
    __decorate([
        common_1.Get(),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Obtener todos los boletos' })
    ], BoletosController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Obtener un boleto por ID' }),
        __param(0, common_1.Param('id'))
    ], BoletosController.prototype, "findOne");
    __decorate([
        common_1.Patch(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Actualizar un boleto' }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], BoletosController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Eliminar un boleto' }),
        __param(0, common_1.Param('id'))
    ], BoletosController.prototype, "remove");
    __decorate([
        common_1.Get('funcion/:funcionId'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR', 'CLIENTE'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Obtener boletos por función' }),
        __param(0, common_1.Param('funcionId'))
    ], BoletosController.prototype, "getBoletosPorFuncion");
    __decorate([
        common_1.Post('verificar-qr'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Verificar un boleto por código QR' }),
        __param(0, common_1.Body())
    ], BoletosController.prototype, "verificarQR");
    __decorate([
        common_1.Get('validar/:codigoQR'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN', 'VENDEDOR'),
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiOperation({ summary: 'Validar un boleto para ingreso por código QR' }),
        __param(0, common_1.Param('codigoQR'))
    ], BoletosController.prototype, "validarBoleto");
    BoletosController = __decorate([
        swagger_1.ApiTags('boletos'),
        common_1.Controller('boletos')
    ], BoletosController);
    return BoletosController;
}());
exports.BoletosController = BoletosController;
