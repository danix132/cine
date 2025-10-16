"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SalasModule = void 0;
var common_1 = require("@nestjs/common");
var salas_service_1 = require("./salas.service");
var salas_controller_1 = require("./salas.controller");
var SalasModule = /** @class */ (function () {
    function SalasModule() {
    }
    SalasModule = __decorate([
        common_1.Module({
            controllers: [salas_controller_1.SalasController],
            providers: [salas_service_1.SalasService],
            exports: [salas_service_1.SalasService]
        })
    ], SalasModule);
    return SalasModule;
}());
exports.SalasModule = SalasModule;
