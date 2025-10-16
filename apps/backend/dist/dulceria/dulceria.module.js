"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DulceriaModule = void 0;
const common_1 = require("@nestjs/common");
const dulceria_service_1 = require("./dulceria.service");
const dulceria_controller_1 = require("./dulceria.controller");
let DulceriaModule = class DulceriaModule {
};
exports.DulceriaModule = DulceriaModule;
exports.DulceriaModule = DulceriaModule = __decorate([
    (0, common_1.Module)({
        controllers: [dulceria_controller_1.DulceriaController],
        providers: [dulceria_service_1.DulceriaService],
        exports: [dulceria_service_1.DulceriaService],
    })
], DulceriaModule);
//# sourceMappingURL=dulceria.module.js.map