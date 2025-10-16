"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DebugComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var DebugComponent = /** @class */ (function () {
    function DebugComponent(authService, peliculasService, salasService) {
        this.authService = authService;
        this.peliculasService = peliculasService;
        this.salasService = salasService;
        this.logs = [];
    }
    DebugComponent.prototype.log = function (message, data) {
        var timestamp = new Date().toLocaleTimeString();
        var logEntry = "[" + timestamp + "] " + message + " " + (data ? JSON.stringify(data, null, 2) : '');
        this.logs.push(logEntry);
        console.log(message, data);
    };
    DebugComponent.prototype.getTokenStatus = function () {
        if (typeof window !== 'undefined' && window.localStorage) {
            var token = localStorage.getItem('token');
            return token ? token.length + " chars (" + token.substring(0, 20) + "...)" : 'No token';
        }
        return 'SSR - No localStorage';
    };
    DebugComponent.prototype.getUserStatus = function () {
        if (typeof window !== 'undefined' && window.localStorage) {
            var user = localStorage.getItem('user');
            if (user) {
                try {
                    var parsedUser = JSON.parse(user);
                    return parsedUser.email + " (" + parsedUser.rol + ")";
                }
                catch (_a) {
                    return 'Usuario corrupto';
                }
            }
            return 'No usuario';
        }
        return 'SSR - No localStorage';
    };
    DebugComponent.prototype.testLogin = function () {
        var _this = this;
        this.log('🔑 Iniciando test de login...');
        var loginData = {
            email: 'admin@cine.com',
            password: 'Admin123'
        };
        this.authService.login(loginData).subscribe({
            next: function (response) {
                _this.log('✅ Login exitoso', response);
                // Verificar inmediatamente
                setTimeout(function () {
                    var token = localStorage.getItem('token');
                    var user = localStorage.getItem('user');
                    _this.log('📊 Estado post-login', {
                        hasToken: !!token,
                        hasUser: !!user,
                        tokenLength: token === null || token === void 0 ? void 0 : token.length,
                        isAuthenticated: _this.authService.isAuthenticated()
                    });
                }, 100);
            },
            error: function (error) {
                _this.log('❌ Error en login', error);
            }
        });
    };
    DebugComponent.prototype.testPeliculas = function () {
        var _this = this;
        this.log('🎬 Probando petición a películas...');
        this.peliculasService.testAuthenticatedRequest().subscribe({
            next: function (response) {
                _this.log('✅ Películas OK', response);
            },
            error: function (error) {
                _this.log('❌ Error películas', error);
            }
        });
    };
    DebugComponent.prototype.testSalas = function () {
        var _this = this;
        this.log('🏢 Probando petición a salas...');
        this.salasService.getSalas().subscribe({
            next: function (response) {
                _this.log('✅ Salas OK', response);
            },
            error: function (error) {
                _this.log('❌ Error salas', error);
            }
        });
    };
    DebugComponent.prototype.clearStorage = function () {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.clear();
            this.log('🗑️ Storage limpiado');
        }
        else {
            this.log('⚠️ No se puede limpiar storage en SSR');
        }
    };
    DebugComponent = __decorate([
        core_1.Component({
            selector: 'app-debug',
            standalone: true,
            imports: [common_1.CommonModule],
            template: "\n    <div style=\"padding: 20px; font-family: monospace;\">\n      <h2>\uD83D\uDD27 Debug de Autenticaci\u00F3n</h2>\n      \n      <div style=\"margin-bottom: 20px;\">\n        <h3>Estado Actual</h3>\n        <div>Token: {{ getTokenStatus() }}</div>\n        <div>Usuario: {{ getUserStatus() }}</div>\n        <div>Autenticado: {{ authService.isAuthenticated() }}</div>\n      </div>\n\n      <div style=\"margin-bottom: 20px;\">\n        <h3>Acciones de Test</h3>\n        <button (click)=\"testLogin()\" style=\"margin-right: 10px; padding: 10px;\">\n          \uD83D\uDD11 Test Login\n        </button>\n        <button (click)=\"testPeliculas()\" style=\"margin-right: 10px; padding: 10px;\">\n          \uD83C\uDFAC Test Pel\u00EDculas\n        </button>\n        <button (click)=\"testSalas()\" style=\"margin-right: 10px; padding: 10px;\">\n          \uD83C\uDFE2 Test Salas\n        </button>\n        <button (click)=\"clearStorage()\" style=\"margin-right: 10px; padding: 10px;\">\n          \uD83D\uDDD1\uFE0F Limpiar Storage\n        </button>\n      </div>\n\n      <div style=\"margin-bottom: 20px;\">\n        <h3>Logs</h3>\n        <div style=\"background: #f0f0f0; padding: 10px; height: 300px; overflow-y: scroll;\">\n          <div *ngFor=\"let log of logs\" [innerHTML]=\"log\"></div>\n        </div>\n      </div>\n    </div>\n  "
        })
    ], DebugComponent);
    return DebugComponent;
}());
exports.DebugComponent = DebugComponent;
