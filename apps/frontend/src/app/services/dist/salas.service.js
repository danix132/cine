"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SalasService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var SalasService = /** @class */ (function () {
    function SalasService(http) {
        this.http = http;
        this.API_URL = environment_1.environment.apiUrl + "/salas";
    }
    SalasService.prototype.getSalas = function (params) {
        console.log('🏢 SalasService - Obteniendo salas con params:', params);
        // Debug del token antes de la petición (solo en navegador)
        if (typeof window !== 'undefined' && window.localStorage) {
            var token = localStorage.getItem('token');
            var user = localStorage.getItem('user');
            console.log('🏢 Estado de autenticación para salas:', {
                hasToken: !!token,
                tokenLength: (token === null || token === void 0 ? void 0 : token.length) || 0,
                hasUser: !!user,
                tokenStart: (token === null || token === void 0 ? void 0 : token.substring(0, 20)) + '...' || 'No token'
            });
        }
        else {
            console.log('🏢 SSR - No localStorage disponible');
        }
        var httpParams = new http_1.HttpParams();
        if (params === null || params === void 0 ? void 0 : params.page)
            httpParams = httpParams.set('page', params.page.toString());
        if (params === null || params === void 0 ? void 0 : params.limit)
            httpParams = httpParams.set('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.search)
            httpParams = httpParams.set('search', params.search);
        return this.http.get(this.API_URL, { params: httpParams });
    };
    SalasService.prototype.getSala = function (id) {
        return this.http.get(this.API_URL + "/" + id);
    };
    SalasService.prototype.createSala = function (sala) {
        return this.http.post(this.API_URL, sala);
    };
    SalasService.prototype.updateSala = function (id, sala) {
        console.log('🔄 SalasService - Actualizando sala:', { id: id, sala: sala });
        console.log('🔄 URL de actualización:', this.API_URL + "/" + id);
        console.log('🔄 Tipos de datos en el servicio:', {
            nombre: typeof sala.nombre,
            filas: typeof sala.filas,
            asientosPorFila: typeof sala.asientosPorFila,
            filasValue: sala.filas,
            asientosPorFilaValue: sala.asientosPorFila
        });
        console.log('🔄 JSON.stringify del objeto:', JSON.stringify(sala));
        return this.http.patch(this.API_URL + "/" + id, sala);
    };
    SalasService.prototype.deleteSala = function (id) {
        return this.http["delete"](this.API_URL + "/" + id);
    };
    SalasService.prototype.updateAsientosDanados = function (salaId, asientosDanados) {
        return this.http.patch(this.API_URL + "/" + salaId + "/asientos-danados", asientosDanados);
    };
    SalasService.prototype.getAsientosDisponibles = function (salaId, funcionId) {
        return this.http.get(this.API_URL + "/" + salaId + "/asientos-disponibles/" + funcionId);
    };
    SalasService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SalasService);
    return SalasService;
}());
exports.SalasService = SalasService;
