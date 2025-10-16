"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateAsientosDanadosDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var AsientoDanadoDto = /** @class */ (function () {
    function AsientoDanadoDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 5, minimum: 1 }),
        class_validator_1.IsInt(),
        class_validator_1.Min(1)
    ], AsientoDanadoDto.prototype, "fila");
    __decorate([
        swagger_1.ApiProperty({ example: 10, minimum: 1 }),
        class_validator_1.IsInt(),
        class_validator_1.Min(1)
    ], AsientoDanadoDto.prototype, "numero");
    return AsientoDanadoDto;
}());
var UpdateAsientosDanadosDto = /** @class */ (function () {
    function UpdateAsientosDanadosDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ type: [AsientoDanadoDto] }),
        class_validator_1.IsArray(),
        class_validator_1.ValidateNested({ each: true }),
        class_transformer_1.Type(function () { return AsientoDanadoDto; })
    ], UpdateAsientosDanadosDto.prototype, "asientosDanados");
    return UpdateAsientosDanadosDto;
}());
exports.UpdateAsientosDanadosDto = UpdateAsientosDanadosDto;
