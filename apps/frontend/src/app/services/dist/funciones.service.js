"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FuncionesService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var FuncionesService = /** @class */ (function () {
    function FuncionesService(http) {
        this.http = http;
        this.API_URL = environment_1.environment.apiUrl + "/funciones";
    }
    FuncionesService.prototype.getFunciones = function (params) {
        var httpParams = new http_1.HttpParams();
        if (params === null || params === void 0 ? void 0 : params.page)
            httpParams = httpParams.set('page', params.page.toString());
        if (params === null || params === void 0 ? void 0 : params.limit)
            httpParams = httpParams.set('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.search)
            httpParams = httpParams.set('search', params.search);
        if (params === null || params === void 0 ? void 0 : params.peliculaId)
            httpParams = httpParams.set('peliculaId', params.peliculaId);
        if (params === null || params === void 0 ? void 0 : params.salaId)
            httpParams = httpParams.set('salaId', params.salaId);
        if (params === null || params === void 0 ? void 0 : params.desde)
            httpParams = httpParams.set('desde', params.desde);
        if (params === null || params === void 0 ? void 0 : params.hasta)
            httpParams = httpParams.set('hasta', params.hasta);
        if ((params === null || params === void 0 ? void 0 : params.cancelada) !== undefined)
            httpParams = httpParams.set('cancelada', params.cancelada.toString());
        return this.http.get(this.API_URL, { params: httpParams });
    };
    FuncionesService.prototype.getFuncion = function (id) {
        return this.http.get(this.API_URL + "/" + id);
    };
    FuncionesService.prototype.createFuncion = function (funcion) {
        return this.http.post(this.API_URL, funcion);
    };
    FuncionesService.prototype.updateFuncion = function (id, funcion) {
        return this.http.patch(this.API_URL + "/" + id, funcion);
    };
    FuncionesService.prototype.deleteFuncion = function (id) {
        return this.http["delete"](this.API_URL + "/" + id);
    };
    FuncionesService.prototype.getFuncionesPorPelicula = function (peliculaId) {
        return this.http.get(this.API_URL + "/pelicula/" + peliculaId);
    };
    FuncionesService.prototype.getFuncionesPorSala = function (salaId) {
        return this.http.get(this.API_URL + "/sala/" + salaId);
    };
    FuncionesService.prototype.getFuncionesDisponibles = function () {
        return this.http.get(this.API_URL + "/disponibles");
    };
    FuncionesService.prototype.debugConflictos = function (funcion) {
        return this.http.post(this.API_URL + "/debug", funcion);
    };
    FuncionesService.prototype.cancelarFuncion = function (id) {
        return this.http.post(this.API_URL + "/" + id + "/cancelar", {});
    };
    FuncionesService.prototype.reactivarFuncion = function (id) {
        return this.http.post(this.API_URL + "/" + id + "/reactivar", {});
    };
    FuncionesService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], FuncionesService);
    return FuncionesService;
}());
exports.FuncionesService = FuncionesService;
