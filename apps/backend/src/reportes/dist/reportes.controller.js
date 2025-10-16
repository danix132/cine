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
exports.ReportesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var ReportesController = /** @class */ (function () {
    function ReportesController(reportesService) {
        this.reportesService = reportesService;
    }
    ReportesController.prototype.reporteVentas = function (desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            var fechaDesde, fechaHasta;
            return __generator(this, function (_a) {
                console.log('🔍 CONTROLLER: Parámetros recibidos para reporte de ventas:', { desde: desde, hasta: hasta });
                fechaDesde = new Date(desde);
                fechaHasta = new Date(hasta);
                // Ajustar 'hasta' al final del día (23:59:59.999)
                fechaHasta.setHours(23, 59, 59, 999);
                console.log('📅 CONTROLLER: Fechas convertidas:', { fechaDesde: fechaDesde, fechaHasta: fechaHasta });
                return [2 /*return*/, this.reportesService.reporteVentas(fechaDesde, fechaHasta)];
            });
        });
    };
    ReportesController.prototype.reporteOcupacion = function (desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.reportesService.reporteOcupacion(new Date(desde), new Date(hasta))];
            });
        });
    };
    ReportesController.prototype.reporteTopPeliculas = function (desde, hasta, limit) {
        if (limit === void 0) { limit = 10; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.reportesService.reporteTopPeliculas(new Date(desde), new Date(hasta), limit)];
            });
        });
    };
    ReportesController.prototype.reporteVentasPorVendedor = function (desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.reportesService.reporteVentasPorVendedor(new Date(desde), new Date(hasta))];
            });
        });
    };
    ReportesController.prototype.reporteDesglosePorTipo = function (vendedorId, desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            var fechaDesde, fechaHasta;
            return __generator(this, function (_a) {
                fechaDesde = desde ? new Date(desde) : new Date(new Date().setDate(new Date().getDate() - 30));
                fechaHasta = hasta ? new Date(hasta) : new Date();
                // Ajustar 'hasta' al final del día
                fechaHasta.setHours(23, 59, 59, 999);
                return [2 /*return*/, this.reportesService.reporteDesglosePorTipo(vendedorId, fechaDesde, fechaHasta)];
            });
        });
    };
    ReportesController.prototype.reporteMisVentas = function (desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            var fechaDesde, fechaHasta;
            return __generator(this, function (_a) {
                fechaDesde = desde ? new Date(desde) : new Date(new Date().setDate(new Date().getDate() - 30));
                fechaHasta = hasta ? new Date(hasta) : new Date();
                // Ajustar 'hasta' al final del día
                fechaHasta.setHours(23, 59, 59, 999);
                return [2 /*return*/, this.reportesService.reporteVentasPorVendedor(fechaDesde, fechaHasta)];
            });
        });
    };
    ReportesController.prototype.reporteVentasDulceria = function (desde, hasta) {
        return __awaiter(this, void 0, void 0, function () {
            var fechaDesde, fechaHasta;
            return __generator(this, function (_a) {
                console.log('🍿 CONTROLLER: Generando reporte de ventas de dulcería');
                console.log('📅 CONTROLLER: Período:', { desde: desde, hasta: hasta });
                fechaDesde = new Date(desde);
                fechaHasta = new Date(hasta);
                // Ajustar 'hasta' al final del día
                fechaHasta.setHours(23, 59, 59, 999);
                return [2 /*return*/, this.reportesService.reporteVentasDulceria(fechaDesde, fechaHasta)];
            });
        });
    };
    __decorate([
        common_1.Get('ventas'),
        swagger_1.ApiOperation({ summary: 'Reporte de ventas por período' }),
        swagger_1.ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
        swagger_1.ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
        __param(0, common_1.Query('desde')),
        __param(1, common_1.Query('hasta'))
    ], ReportesController.prototype, "reporteVentas");
    __decorate([
        common_1.Get('ocupacion'),
        swagger_1.ApiOperation({ summary: 'Reporte de ocupación de salas por período' }),
        swagger_1.ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
        swagger_1.ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
        __param(0, common_1.Query('desde')),
        __param(1, common_1.Query('hasta'))
    ], ReportesController.prototype, "reporteOcupacion");
    __decorate([
        common_1.Get('top-peliculas'),
        swagger_1.ApiOperation({ summary: 'Top películas por ventas en período' }),
        swagger_1.ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
        swagger_1.ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
        swagger_1.ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados' }),
        __param(0, common_1.Query('desde')),
        __param(1, common_1.Query('hasta')),
        __param(2, common_1.Query('limit'))
    ], ReportesController.prototype, "reporteTopPeliculas");
    __decorate([
        common_1.Get('ventas-por-vendedor'),
        swagger_1.ApiOperation({ summary: 'Reporte de ventas por vendedor en período' }),
        swagger_1.ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
        swagger_1.ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
        __param(0, common_1.Query('desde')),
        __param(1, common_1.Query('hasta'))
    ], ReportesController.prototype, "reporteVentasPorVendedor");
    __decorate([
        common_1.Get('mis-ventas/:vendedorId/desglose'),
        roles_decorator_1.Roles('VENDEDOR', 'ADMIN'),
        swagger_1.ApiOperation({ summary: 'Desglose de ventas por tipo (boletos/dulcería) de un vendedor' }),
        swagger_1.ApiQuery({ name: 'desde', required: false, type: String, description: 'Fecha desde (ISO string)' }),
        swagger_1.ApiQuery({ name: 'hasta', required: false, type: String, description: 'Fecha hasta (ISO string)' }),
        __param(0, common_1.Param('vendedorId')),
        __param(1, common_1.Query('desde')),
        __param(2, common_1.Query('hasta'))
    ], ReportesController.prototype, "reporteDesglosePorTipo");
    __decorate([
        common_1.Get('mis-ventas/:vendedorId'),
        roles_decorator_1.Roles('VENDEDOR', 'ADMIN'),
        swagger_1.ApiOperation({ summary: 'Reporte de ventas de un vendedor específico' }),
        swagger_1.ApiQuery({ name: 'desde', required: false, type: String, description: 'Fecha desde (ISO string)' }),
        swagger_1.ApiQuery({ name: 'hasta', required: false, type: String, description: 'Fecha hasta (ISO string)' }),
        __param(0, common_1.Query('desde')),
        __param(1, common_1.Query('hasta'))
    ], ReportesController.prototype, "reporteMisVentas");
    __decorate([
        common_1.Get('ventas-dulceria'),
        swagger_1.ApiOperation({ summary: 'Reporte de ventas de dulcería por período' }),
        swagger_1.ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
        swagger_1.ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
        __param(0, common_1.Query('desde')),
        __param(1, common_1.Query('hasta'))
    ], ReportesController.prototype, "reporteVentasDulceria");
    ReportesController = __decorate([
        swagger_1.ApiTags('reportes'),
        common_1.Controller('reportes'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        roles_decorator_1.Roles('ADMIN'),
        swagger_1.ApiBearerAuth()
    ], ReportesController);
    return ReportesController;
}());
exports.ReportesController = ReportesController;
