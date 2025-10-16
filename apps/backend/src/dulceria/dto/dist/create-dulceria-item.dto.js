"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateDulceriaItemDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var CreateDulceriaItemDto = /** @class */ (function () {
    function CreateDulceriaItemDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'Combo Nachos Grande', minLength: 2, maxLength: 100 }),
        class_validator_1.IsString(),
        class_validator_1.MinLength(2),
        class_validator_1.MaxLength(100)
    ], CreateDulceriaItemDto.prototype, "nombre");
    __decorate([
        swagger_1.ApiProperty({ "enum": client_1.DulceriaItemTipo, example: client_1.DulceriaItemTipo.COMBO }),
        class_validator_1.IsEnum(client_1.DulceriaItemTipo)
    ], CreateDulceriaItemDto.prototype, "tipo");
    __decorate([
        swagger_1.ApiPropertyOptional({ example: 'Nachos con queso, guacamole y salsa', maxLength: 500 }),
        class_validator_1.IsOptional(),
        class_validator_1.IsString(),
        class_validator_1.MaxLength(500)
    ], CreateDulceriaItemDto.prototype, "descripcion");
    __decorate([
        swagger_1.ApiProperty({ example: 89.99, minimum: 0 }),
        class_validator_1.IsNumber(),
        class_validator_1.Min(0)
    ], CreateDulceriaItemDto.prototype, "precio");
    __decorate([
        swagger_1.ApiPropertyOptional({ example: 'https://example.com/imagen-nachos.jpg' }),
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreateDulceriaItemDto.prototype, "imagenUrl");
    __decorate([
        swagger_1.ApiPropertyOptional({ example: true, "default": true }),
        class_validator_1.IsOptional(),
        class_validator_1.IsBoolean()
    ], CreateDulceriaItemDto.prototype, "activo");
    return CreateDulceriaItemDto;
}());
exports.CreateDulceriaItemDto = CreateDulceriaItemDto;
