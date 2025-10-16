"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReportesService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var ReportesService = /** @class */ (function () {
    function ReportesService(http) {
        this.http = http;
        this.apiUrl = environment_1.environment.apiUrl + "/reportes";
    }
    ReportesService.prototype.getReporteVentas = function (desde, hasta) {
        var params = new http_1.HttpParams()
            .set('desde', desde)
            .set('hasta', hasta);
        return this.http.get(this.apiUrl + "/ventas", { params: params });
    };
    ReportesService.prototype.getReporteOcupacion = function (desde, hasta) {
        var params = new http_1.HttpParams()
            .set('desde', desde)
            .set('hasta', hasta);
        return this.http.get(this.apiUrl + "/ocupacion", { params: params });
    };
    ReportesService.prototype.getReporteTopPeliculas = function (desde, hasta, limit) {
        if (limit === void 0) { limit = 10; }
        var params = new http_1.HttpParams()
            .set('desde', desde)
            .set('hasta', hasta)
            .set('limit', limit.toString());
        return this.http.get(this.apiUrl + "/top-peliculas", { params: params });
    };
    ReportesService.prototype.getReporteVentasPorVendedor = function (desde, hasta) {
        var params = new http_1.HttpParams()
            .set('desde', desde)
            .set('hasta', hasta);
        return this.http.get(this.apiUrl + "/ventas-por-vendedor", { params: params });
    };
    ReportesService.prototype.getReporteVentasDulceria = function (desde, hasta) {
        var params = new http_1.HttpParams()
            .set('desde', desde)
            .set('hasta', hasta);
        return this.http.get(this.apiUrl + "/ventas-dulceria", { params: params });
    };
    ReportesService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ReportesService);
    return ReportesService;
}());
exports.ReportesService = ReportesService;
