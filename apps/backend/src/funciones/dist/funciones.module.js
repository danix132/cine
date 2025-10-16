"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FuncionesModule = void 0;
var common_1 = require("@nestjs/common");
var funciones_service_1 = require("./funciones.service");
var funciones_controller_1 = require("./funciones.controller");
var FuncionesModule = /** @class */ (function () {
    function FuncionesModule() {
    }
    FuncionesModule = __decorate([
        common_1.Module({
            controllers: [funciones_controller_1.FuncionesController],
            providers: [funciones_service_1.FuncionesService],
            exports: [funciones_service_1.FuncionesService]
        })
    ], FuncionesModule);
    return FuncionesModule;
}());
exports.FuncionesModule = FuncionesModule;
