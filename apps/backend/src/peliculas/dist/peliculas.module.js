"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PeliculasModule = void 0;
var common_1 = require("@nestjs/common");
var peliculas_service_1 = require("./peliculas.service");
var peliculas_controller_1 = require("./peliculas.controller");
var PeliculasModule = /** @class */ (function () {
    function PeliculasModule() {
    }
    PeliculasModule = __decorate([
        common_1.Module({
            controllers: [peliculas_controller_1.PeliculasController],
            providers: [peliculas_service_1.PeliculasService],
            exports: [peliculas_service_1.PeliculasService]
        })
    ], PeliculasModule);
    return PeliculasModule;
}());
exports.PeliculasModule = PeliculasModule;
