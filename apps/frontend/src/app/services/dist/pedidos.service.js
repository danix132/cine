"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PedidosService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var PedidosService = /** @class */ (function () {
    function PedidosService(http) {
        this.http = http;
        this.API_URL = environment_1.environment.apiUrl + "/pedidos";
    }
    PedidosService.prototype.getPedidos = function (params) {
        var httpParams = new http_1.HttpParams();
        if (params === null || params === void 0 ? void 0 : params.page)
            httpParams = httpParams.set('page', params.page.toString());
        if (params === null || params === void 0 ? void 0 : params.limit)
            httpParams = httpParams.set('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.search)
            httpParams = httpParams.set('search', params.search);
        return this.http.get(this.API_URL, { params: httpParams });
    };
    PedidosService.prototype.getPedido = function (id) {
        return this.http.get(this.API_URL + "/" + id);
    };
    PedidosService.prototype.createPedido = function (pedido) {
        return this.http.post(this.API_URL, pedido);
    };
    PedidosService.prototype.updatePedido = function (id, pedido) {
        return this.http.patch(this.API_URL + "/" + id, pedido);
    };
    PedidosService.prototype.deletePedido = function (id) {
        return this.http["delete"](this.API_URL + "/" + id);
    };
    PedidosService.prototype.getPedidosPorUsuario = function (usuarioId) {
        return this.http.get(this.API_URL + "/usuario/" + usuarioId);
    };
    PedidosService.prototype.getPedidosPorVendedor = function (vendedorId) {
        return this.http.get(this.API_URL + "/vendedor/" + vendedorId);
    };
    PedidosService.prototype.procesarPedidoDesdeCarrito = function (carritoId) {
        return this.http.post(this.API_URL + "/procesar-carrito/" + carritoId, {});
    };
    PedidosService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], PedidosService);
    return PedidosService;
}());
exports.PedidosService = PedidosService;
