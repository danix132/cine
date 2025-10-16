"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BoletosService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var BoletosService = /** @class */ (function () {
    function BoletosService(http) {
        this.http = http;
        this.API_URL = environment_1.environment.apiUrl + "/boletos";
    }
    BoletosService.prototype.getBoletos = function (params) {
        var httpParams = new http_1.HttpParams();
        if (params === null || params === void 0 ? void 0 : params.page)
            httpParams = httpParams.set('page', params.page.toString());
        if (params === null || params === void 0 ? void 0 : params.limit)
            httpParams = httpParams.set('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.search)
            httpParams = httpParams.set('search', params.search);
        return this.http.get(this.API_URL, { params: httpParams });
    };
    BoletosService.prototype.getBoleto = function (id) {
        return this.http.get(this.API_URL + "/" + id);
    };
    BoletosService.prototype.createBoleto = function (boleto) {
        return this.http.post(this.API_URL, boleto);
    };
    BoletosService.prototype.updateBoleto = function (id, boleto) {
        return this.http.patch(this.API_URL + "/" + id, boleto);
    };
    BoletosService.prototype.deleteBoleto = function (id) {
        return this.http["delete"](this.API_URL + "/" + id);
    };
    BoletosService.prototype.getBoletosPorUsuario = function (usuarioId) {
        return this.http.get(this.API_URL + "/usuario/" + usuarioId);
    };
    BoletosService.prototype.getBoletosPorFuncion = function (funcionId) {
        return this.http.get(this.API_URL + "/funcion/" + funcionId);
    };
    BoletosService.prototype.validarBoleto = function (codigoQR) {
        return this.http.get(this.API_URL + "/validar/" + codigoQR);
    };
    BoletosService.prototype.pagarBoleto = function (id) {
        return this.http.patch(this.API_URL + "/" + id + "/pagar", {});
    };
    BoletosService.prototype.cancelarBoleto = function (id) {
        return this.http.patch(this.API_URL + "/" + id + "/cancelar", {});
    };
    BoletosService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], BoletosService);
    return BoletosService;
}());
exports.BoletosService = BoletosService;
