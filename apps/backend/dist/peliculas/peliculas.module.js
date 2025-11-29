"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeliculasModule = void 0;
const common_1 = require("@nestjs/common");
const peliculas_service_1 = require("./peliculas.service");
const peliculas_controller_1 = require("./peliculas.controller");
const recomendaciones_service_1 = require("./recomendaciones.service");
const gemini_service_1 = require("../modules/gemini.service");
let PeliculasModule = class PeliculasModule {
};
exports.PeliculasModule = PeliculasModule;
exports.PeliculasModule = PeliculasModule = __decorate([
    (0, common_1.Module)({
        controllers: [peliculas_controller_1.PeliculasController],
        providers: [peliculas_service_1.PeliculasService, recomendaciones_service_1.RecomendacionesService, gemini_service_1.GeminiService],
        exports: [peliculas_service_1.PeliculasService],
    })
], PeliculasModule);
//# sourceMappingURL=peliculas.module.js.map