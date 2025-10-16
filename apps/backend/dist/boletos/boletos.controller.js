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
exports.BoletosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const boletos_service_1 = require("./boletos.service");
const create_boleto_dto_1 = require("./dto/create-boleto.dto");
const update_boleto_dto_1 = require("./dto/update-boleto.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let BoletosController = class BoletosController {
    constructor(boletosService) {
        this.boletosService = boletosService;
    }
    async create(createBoletoDto) {
        console.log('🎯 CONTROLLER: POST /boletos llamado con:', JSON.stringify(createBoletoDto, null, 2));
        console.log('🔍 CONTROLLER: Tipo de datos recibidos:', {
            funcionId: typeof createBoletoDto.funcionId,
            asientoId: typeof createBoletoDto.asientoId,
            usuarioId: typeof createBoletoDto.usuarioId,
            estado: typeof createBoletoDto.estado,
            vendedorId: typeof createBoletoDto.vendedorId,
        });
        console.log('👤 CONTROLLER: VendedorId recibido:', createBoletoDto.vendedorId || 'NO PROPORCIONADO');
        try {
            const result = await this.boletosService.create(createBoletoDto);
            console.log('✅ CONTROLLER: Boleto creado exitosamente:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ CONTROLLER: Error al crear boleto:', error.message);
            console.error('❌ CONTROLLER: Stack trace:', error.stack);
            throw error;
        }
    }
    findAll() {
        console.log('📋 CONTROLLER: GET /boletos llamado');
        return this.boletosService.findAll();
    }
    findOne(id) {
        return this.boletosService.findOne(id);
    }
    update(id, updateBoletoDto) {
        return this.boletosService.update(id, updateBoletoDto);
    }
    remove(id) {
        return this.boletosService.remove(id);
    }
    getBoletosPorFuncion(funcionId) {
        console.log('🎯 CONTROLLER: GET /boletos/funcion/' + funcionId);
        return this.boletosService.getBoletosPorFuncion(funcionId);
    }
    verificarQR(body) {
        return this.boletosService.verificarQR(body.codigoQR);
    }
    async validarBoleto(codigoQR) {
        console.log('🎫 CONTROLLER: Validando boleto con QR:', codigoQR);
        const resultado = await this.boletosService.validarBoleto(codigoQR);
        console.log('📤 CONTROLLER: Devolviendo resultado:', {
            cantidad: Array.isArray(resultado) ? resultado.length : 1,
            esArray: Array.isArray(resultado),
            primerBoleto: Array.isArray(resultado) ? resultado[0]?.id : resultado
        });
        return resultado;
    }
    async crearBoletosCompra(body) {
        console.log('🛒 CONTROLLER: POST /boletos/compra llamado con:', body);
        try {
            const boletos = await this.boletosService.crearBoletosCompra(body);
            console.log('✅ CONTROLLER: Boletos de compra creados:', boletos.length);
            return boletos;
        }
        catch (error) {
            console.error('❌ CONTROLLER: Error al crear boletos de compra:', error.message);
            throw error;
        }
    }
};
exports.BoletosController = BoletosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'VENDEDOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo boleto' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_boleto_dto_1.CreateBoletoDto]),
    __metadata("design:returntype", Promise)
], BoletosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'VENDEDOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los boletos con relaciones' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'VENDEDOR', 'CLIENTE'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un boleto por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'VENDEDOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un boleto' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_boleto_dto_1.UpdateBoletoDto]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un boleto' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('funcion/:funcionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'VENDEDOR', 'CLIENTE'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener boletos por función' }),
    __param(0, (0, common_1.Param)('funcionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "getBoletosPorFuncion", null);
__decorate([
    (0, common_1.Post)('verificar-qr'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'VENDEDOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar un boleto por código QR' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "verificarQR", null);
__decorate([
    (0, common_1.Get)('validar/:codigoQR'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'VENDEDOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Validar un boleto para ingreso por código QR' }),
    __param(0, (0, common_1.Param)('codigoQR')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BoletosController.prototype, "validarBoleto", null);
__decorate([
    (0, common_1.Post)('compra'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear múltiples boletos para una compra de cliente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BoletosController.prototype, "crearBoletosCompra", null);
exports.BoletosController = BoletosController = __decorate([
    (0, swagger_1.ApiTags)('boletos'),
    (0, common_1.Controller)('boletos'),
    __metadata("design:paramtypes", [boletos_service_1.BoletosService])
], BoletosController);
//# sourceMappingURL=boletos.controller.js.map