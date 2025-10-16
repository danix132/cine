"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var AppController = /** @class */ (function () {
    function AppController() {
    }
    AppController.prototype.getHello = function () {
        return {
            message: 'Bienvenido a la API de Cine',
            version: '1.0.0',
            description: 'API para gestión de cine, películas, funciones, boletos y más',
            endpoints: [
                '/auth - Autenticación de usuarios',
                '/users - Gestión de usuarios',
                '/peliculas - Gestión de películas',
                '/salas - Gestión de salas',
                '/funciones - Gestión de funciones',
                '/boletos - Gestión de boletos',
                '/carritos - Gestión de carritos de compra',
                '/pedidos - Gestión de pedidos',
                '/dulceria - Gestión de dulcería',
                '/reportes - Reportes del sistema'
            ]
        };
    };
    AppController.prototype.getHealth = function () {
        return {
            status: 'OK',
            timestamp: new Date().toISOString()
        };
    };
    __decorate([
        common_1.Get(),
        swagger_1.ApiOperation({ summary: 'Página principal de la API' }),
        swagger_1.ApiResponse({
            status: 200,
            description: 'Información de la API de Cine',
            schema: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    version: { type: 'string' },
                    description: { type: 'string' },
                    endpoints: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                }
            }
        })
    ], AppController.prototype, "getHello");
    __decorate([
        common_1.Get('health'),
        swagger_1.ApiOperation({ summary: 'Verificar estado de la API' }),
        swagger_1.ApiResponse({
            status: 200,
            description: 'API funcionando correctamente',
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    timestamp: { type: 'string' }
                }
            }
        })
    ], AppController.prototype, "getHealth");
    AppController = __decorate([
        swagger_1.ApiTags('Principal'),
        common_1.Controller()
    ], AppController);
    return AppController;
}());
exports.AppController = AppController;
