"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CarritosService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var CarritosService = /** @class */ (function () {
    function CarritosService(http) {
        this.http = http;
        this.API_URL = environment_1.environment.apiUrl + "/carritos";
    }
    CarritosService.prototype.createCarrito = function (carrito) {
        return this.http.post(this.API_URL, carrito);
    };
    CarritosService.prototype.getCarrito = function (id) {
        return this.http.get(this.API_URL + "/" + id);
    };
    CarritosService.prototype.addItem = function (carritoId, item) {
        return this.http.post(this.API_URL + "/" + carritoId + "/items", item);
    };
    CarritosService.prototype.updateItem = function (carritoId, itemId, item) {
        return this.http.patch(this.API_URL + "/" + carritoId + "/items/" + itemId, item);
    };
    CarritosService.prototype.removeItem = function (carritoId, itemId) {
        return this.http["delete"](this.API_URL + "/" + carritoId + "/items/" + itemId);
    };
    CarritosService.prototype.clearCarrito = function (carritoId) {
        return this.http["delete"](this.API_URL + "/" + carritoId + "/items");
    };
    CarritosService.prototype.getCarritoActivo = function (usuarioId) {
        var httpParams = new http_1.HttpParams();
        if (usuarioId) {
            httpParams = httpParams.set('usuarioId', usuarioId);
        }
        return this.http.get(this.API_URL + "/activo", { params: httpParams });
    };
    CarritosService.prototype.calcularTotal = function (carritoId) {
        return this.http.get(this.API_URL + "/" + carritoId + "/total");
    };
    CarritosService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CarritosService);
    return CarritosService;
}());
exports.CarritosService = CarritosService;
