"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AddItemDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var AddItemDto = /** @class */ (function () {
    function AddItemDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ "enum": client_1.CarritoItemTipo, example: client_1.CarritoItemTipo.BOLETO }),
        class_validator_1.IsEnum(client_1.CarritoItemTipo)
    ], AddItemDto.prototype, "tipo");
    __decorate([
        swagger_1.ApiProperty({ example: 'clm1234567890abcdef' }),
        class_validator_1.IsString()
    ], AddItemDto.prototype, "referenciaId");
    __decorate([
        swagger_1.ApiProperty({ example: 1, minimum: 1 }),
        class_validator_1.IsInt(),
        class_validator_1.Min(1)
    ], AddItemDto.prototype, "cantidad");
    __decorate([
        swagger_1.ApiProperty({ example: 150.00, minimum: 0 }),
        class_validator_1.IsNumber(),
        class_validator_1.Min(0)
    ], AddItemDto.prototype, "precioUnitario");
    return AddItemDto;
}());
exports.AddItemDto = AddItemDto;
