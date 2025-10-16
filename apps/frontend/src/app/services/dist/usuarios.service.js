"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsuariosService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var UsuariosService = /** @class */ (function () {
    function UsuariosService(http) {
        this.http = http;
        this.apiUrl = environment_1.environment.apiUrl + "/users";
    }
    // Obtener todos los usuarios con paginación y filtros
    UsuariosService.prototype.getUsuarios = function (params) {
        if (params === void 0) { params = {}; }
        var httpParams = new http_1.HttpParams();
        Object.entries(params).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (value !== undefined && value !== null && value !== '') {
                httpParams = httpParams.set(key, value.toString());
            }
        });
        return this.http.get(this.apiUrl, { params: httpParams });
    };
    // Obtener usuario por ID
    UsuariosService.prototype.getUsuario = function (id) {
        return this.http.get(this.apiUrl + "/" + id);
    };
    // Crear nuevo usuario
    UsuariosService.prototype.createUsuario = function (usuario) {
        return this.http.post(this.apiUrl, usuario);
    };
    // Actualizar usuario
    UsuariosService.prototype.updateUsuario = function (id, usuario) {
        return this.http.patch(this.apiUrl + "/" + id, usuario);
    };
    // Eliminar usuario
    UsuariosService.prototype.deleteUsuario = function (id) {
        return this.http["delete"](this.apiUrl + "/" + id);
    };
    UsuariosService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UsuariosService);
    return UsuariosService;
}());
exports.UsuariosService = UsuariosService;
