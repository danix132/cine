"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var environment_1 = require("../../environments/environment");
var AuthService = /** @class */ (function () {
    function AuthService(http) {
        this.http = http;
        this.API_URL = environment_1.environment.apiUrl + "/auth";
        this.currentUserSubject = new rxjs_1.BehaviorSubject(null);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.loadUserFromStorage();
    }
    AuthService.prototype.login = function (credentials) {
        var _this = this;
        return this.http.post(this.API_URL + "/login", credentials)
            .pipe(rxjs_1.tap(function (response) {
            if (response.token && response.user) {
                if (typeof window !== 'undefined' && window.localStorage) {
                    try {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('user', JSON.stringify(response.user));
                    }
                    catch (error) {
                        console.error('Error guardando en localStorage:', error);
                    }
                }
                _this.currentUserSubject.next(response.user);
            }
            else {
                console.error('Respuesta de login incompleta');
            }
        }));
    };
    AuthService.prototype.register = function (userData) {
        var _this = this;
        return this.http.post(this.API_URL + "/register", userData)
            .pipe(rxjs_1.tap(function (response) {
            if (typeof window !== 'undefined' && window.localStorage && response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            _this.currentUserSubject.next(response.user);
        }));
    };
    AuthService.prototype.logout = function () {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        this.currentUserSubject.next(null);
    };
    AuthService.prototype.getToken = function () {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem('token');
        }
        return null;
    };
    AuthService.prototype.getCurrentUser = function () {
        return this.currentUserSubject.value;
    };
    AuthService.prototype.isAuthenticated = function () {
        var token = this.getToken();
        var user = this.getCurrentUser();
        return !!(token && user);
    };
    AuthService.prototype.hasRole = function (role) {
        var user = this.getCurrentUser();
        return (user === null || user === void 0 ? void 0 : user.rol) === role;
    };
    AuthService.prototype.isAdmin = function () {
        return this.hasRole('ADMIN');
    };
    AuthService.prototype.isVendedor = function () {
        return this.hasRole('VENDEDOR');
    };
    AuthService.prototype.isCliente = function () {
        return this.hasRole('CLIENTE');
    };
    AuthService.prototype.loadUserFromStorage = function () {
        if (typeof window !== 'undefined' && window.localStorage) {
            var userStr = localStorage.getItem('user');
            var token = localStorage.getItem('token');
            if (userStr && token) {
                try {
                    var user = JSON.parse(userStr);
                    this.currentUserSubject.next(user);
                }
                catch (error) {
                    console.error('Error parsing user from storage:', error);
                    this.logout();
                }
            }
            else if (userStr && !token) {
                this.logout();
            }
        }
    };
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
