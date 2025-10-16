"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateFuncionDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateFuncionDto = /** @class */ (function () {
    function CreateFuncionDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'clm1234567890abcdef' }),
        class_validator_1.IsString()
    ], CreateFuncionDto.prototype, "peliculaId");
    __decorate([
        swagger_1.ApiProperty({ example: 'cls1234567890abcdef' }),
        class_validator_1.IsString()
    ], CreateFuncionDto.prototype, "salaId");
    __decorate([
        swagger_1.ApiProperty({ example: '2024-01-15T20:00:00.000Z' }),
        class_validator_1.IsDateString()
    ], CreateFuncionDto.prototype, "inicio");
    __decorate([
        swagger_1.ApiProperty({ example: 150.00, minimum: 0 }),
        class_validator_1.IsNumber(),
        class_validator_1.Min(0)
    ], CreateFuncionDto.prototype, "precio");
    __decorate([
        swagger_1.ApiProperty({ example: false, required: false }),
        class_validator_1.IsOptional(),
        class_validator_1.IsBoolean()
    ], CreateFuncionDto.prototype, "forzarCreacion");
    return CreateFuncionDto;
}());
exports.CreateFuncionDto = CreateFuncionDto;
