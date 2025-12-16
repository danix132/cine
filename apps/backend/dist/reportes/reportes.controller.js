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
exports.ReportesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reportes_service_1 = require("./reportes.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let ReportesController = class ReportesController {
    constructor(reportesService) {
        this.reportesService = reportesService;
    }
    async reporteVentas(desde, hasta) {
        console.log('🔍 CONTROLLER: Parámetros recibidos para reporte de ventas:', { desde, hasta });
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        console.log('📅 CONTROLLER: Fechas convertidas:', { fechaDesde, fechaHasta });
        return this.reportesService.reporteVentas(fechaDesde, fechaHasta);
    }
    async reporteOcupacion(desde, hasta) {
        return this.reportesService.reporteOcupacion(new Date(desde), new Date(hasta));
    }
    async reporteTopPeliculas(desde, hasta, limit = 10) {
        return this.reportesService.reporteTopPeliculas(new Date(desde), new Date(hasta), limit);
    }
    async reporteVentasPorVendedor(desde, hasta) {
        return this.reportesService.reporteVentasPorVendedor(new Date(desde), new Date(hasta));
    }
    async reporteDesglosePorTipo(vendedorId, desde, hasta) {
        const fechaDesde = desde ? new Date(desde) : new Date(new Date().setDate(new Date().getDate() - 30));
        const fechaHasta = hasta ? new Date(hasta) : new Date();
        fechaDesde.setHours(0, 0, 0, 0);
        fechaHasta.setHours(23, 59, 59, 999);
        console.log('📅 CONTROLLER desglose: Fechas ajustadas:', { fechaDesde, fechaHasta });
        return this.reportesService.reporteDesglosePorTipo(vendedorId, fechaDesde, fechaHasta);
    }
    async reporteMisVentas(vendedorId, desde, hasta) {
        const fechaDesde = desde ? new Date(desde) : new Date(new Date().setDate(new Date().getDate() - 30));
        const fechaHasta = hasta ? new Date(hasta) : new Date();
        fechaDesde.setHours(0, 0, 0, 0);
        fechaHasta.setHours(23, 59, 59, 999);
        console.log('📅 CONTROLLER mis-ventas: Fechas ajustadas:', { fechaDesde, fechaHasta });
        return this.reportesService.reporteMisVentasVendedor(vendedorId, fechaDesde, fechaHasta);
    }
    async reporteVentasDulceria(desde, hasta) {
        console.log('🍿 CONTROLLER: Generando reporte de ventas de dulcería');
        console.log('📅 CONTROLLER: Período:', { desde, hasta });
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        return this.reportesService.reporteVentasDulceria(fechaDesde, fechaHasta);
    }
    async reporteVentasPorCanal(desde, hasta) {
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        return this.reportesService.reporteVentasPorCanal(fechaDesde, fechaHasta);
    }
    async reporteDescuentosPromociones(desde, hasta) {
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        return this.reportesService.reporteDescuentosPromociones(fechaDesde, fechaHasta);
    }
    async reporteHorariosPico(desde, hasta) {
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        return this.reportesService.reporteHorariosPico(fechaDesde, fechaHasta);
    }
    async reporteIngresosPorPelicula(desde, hasta) {
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        return this.reportesService.reporteIngresosPorPelicula(fechaDesde, fechaHasta);
    }
    async reporteDashboardKPIs(desde, hasta) {
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        return this.reportesService.reporteDashboardKPIs(fechaDesde, fechaHasta);
    }
    async reporteSerieTemporal(desde, hasta) {
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        return this.reportesService.reporteSerieTemporal(fechaDesde, fechaHasta);
    }
};
exports.ReportesController = ReportesController;
__decorate([
    (0, common_1.Get)('ventas'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte de ventas por período' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteVentas", null);
__decorate([
    (0, common_1.Get)('ocupacion'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte de ocupación de salas por período' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteOcupacion", null);
__decorate([
    (0, common_1.Get)('top-peliculas'),
    (0, swagger_1.ApiOperation)({ summary: 'Top películas por ventas en período' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Límite de resultados' }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteTopPeliculas", null);
__decorate([
    (0, common_1.Get)('ventas-por-vendedor'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte de ventas por vendedor en período' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteVentasPorVendedor", null);
__decorate([
    (0, common_1.Get)('mis-ventas/:vendedorId/desglose'),
    (0, roles_decorator_1.Roles)('VENDEDOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Desglose de ventas por tipo (boletos/dulcería) de un vendedor' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: false, type: String, description: 'Fecha desde (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: false, type: String, description: 'Fecha hasta (ISO string)' }),
    __param(0, (0, common_1.Param)('vendedorId')),
    __param(1, (0, common_1.Query)('desde')),
    __param(2, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteDesglosePorTipo", null);
__decorate([
    (0, common_1.Get)('mis-ventas/:vendedorId'),
    (0, roles_decorator_1.Roles)('VENDEDOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte de ventas de un vendedor específico' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: false, type: String, description: 'Fecha desde (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: false, type: String, description: 'Fecha hasta (ISO string)' }),
    __param(0, (0, common_1.Param)('vendedorId')),
    __param(1, (0, common_1.Query)('desde')),
    __param(2, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteMisVentas", null);
__decorate([
    (0, common_1.Get)('ventas-dulceria'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte de ventas de dulcería por período' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteVentasDulceria", null);
__decorate([
    (0, common_1.Get)('ventas-por-canal'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte de ventas por canal (online/taquilla)' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteVentasPorCanal", null);
__decorate([
    (0, common_1.Get)('descuentos-promociones'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte de descuentos y promociones' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteDescuentosPromociones", null);
__decorate([
    (0, common_1.Get)('horarios-pico'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte de horarios pico de demanda' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteHorariosPico", null);
__decorate([
    (0, common_1.Get)('ingresos-por-pelicula'),
    (0, swagger_1.ApiOperation)({ summary: 'Reporte de ingresos por película con detalle' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteIngresosPorPelicula", null);
__decorate([
    (0, common_1.Get)('dashboard-kpis'),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard con KPIs principales' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteDashboardKPIs", null);
__decorate([
    (0, common_1.Get)('serie-temporal'),
    (0, swagger_1.ApiOperation)({ summary: 'Serie temporal de ventas por día' }),
    (0, swagger_1.ApiQuery)({ name: 'desde', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'hasta', required: true, type: String }),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "reporteSerieTemporal", null);
exports.ReportesController = ReportesController = __decorate([
    (0, swagger_1.ApiTags)('reportes'),
    (0, common_1.Controller)('reportes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reportes_service_1.ReportesService])
], ReportesController);
//# sourceMappingURL=reportes.controller.js.map