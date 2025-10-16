"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DulceriaService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var DulceriaService = /** @class */ (function () {
    function DulceriaService(http) {
        this.http = http;
        this.API_URL = environment_1.environment.apiUrl + "/dulceria";
    }
    DulceriaService.prototype.getItems = function (params) {
        var httpParams = new http_1.HttpParams();
        if (params === null || params === void 0 ? void 0 : params.page)
            httpParams = httpParams.set('page', params.page.toString());
        if (params === null || params === void 0 ? void 0 : params.limit)
            httpParams = httpParams.set('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.search)
            httpParams = httpParams.set('search', params.search);
        return this.http.get(this.API_URL, { params: httpParams });
    };
    DulceriaService.prototype.getItem = function (id) {
        return this.http.get(this.API_URL + "/" + id);
    };
    DulceriaService.prototype.createItem = function (item) {
        return this.http.post(this.API_URL, item);
    };
    DulceriaService.prototype.updateItem = function (id, item) {
        return this.http.patch(this.API_URL + "/" + id, item);
    };
    DulceriaService.prototype.deleteItem = function (id) {
        return this.http["delete"](this.API_URL + "/" + id);
    };
    DulceriaService.prototype.getItemsActivos = function () {
        return this.http.get(this.API_URL + "/activos");
    };
    DulceriaService.prototype.getMovimientosInventario = function (itemId) {
        return this.http.get(this.API_URL + "/" + itemId + "/movimientos");
    };
    DulceriaService.prototype.ajustarInventario = function (itemId, delta, motivo) {
        return this.http.post(this.API_URL + "/" + itemId + "/ajustar", {
            delta: delta,
            motivo: motivo
        });
    };
    DulceriaService.prototype.procesarVenta = function (items) {
        return this.http.post(this.API_URL + "/venta", { items: items });
    };
    DulceriaService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], DulceriaService);
    return DulceriaService;
}());
exports.DulceriaService = DulceriaService;
