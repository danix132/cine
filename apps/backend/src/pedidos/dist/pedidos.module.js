"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PedidosModule = void 0;
var common_1 = require("@nestjs/common");
var pedidos_service_1 = require("./pedidos.service");
var pedidos_controller_1 = require("./pedidos.controller");
var PedidosModule = /** @class */ (function () {
    function PedidosModule() {
    }
    PedidosModule = __decorate([
        common_1.Module({
            controllers: [pedidos_controller_1.PedidosController],
            providers: [pedidos_service_1.PedidosService],
            exports: [pedidos_service_1.PedidosService]
        })
    ], PedidosModule);
    return PedidosModule;
}());
exports.PedidosModule = PedidosModule;
