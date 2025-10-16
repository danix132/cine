"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProcesarVentaDulceriaDto = exports.ItemVentaDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var ItemVentaDto = /** @class */ (function () {
    function ItemVentaDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ description: 'ID del producto de dulcería' }),
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty()
    ], ItemVentaDto.prototype, "dulceriaItemId");
    __decorate([
        swagger_1.ApiProperty({ description: 'Cantidad a vender' }),
        class_validator_1.IsNumber(),
        class_validator_1.Min(1)
    ], ItemVentaDto.prototype, "cantidad");
    return ItemVentaDto;
}());
exports.ItemVentaDto = ItemVentaDto;
var ProcesarVentaDulceriaDto = /** @class */ (function () {
    function ProcesarVentaDulceriaDto() {
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'Items de dulcería a vender',
            type: [ItemVentaDto]
        }),
        class_validator_1.IsArray(),
        class_validator_1.ValidateNested({ each: true }),
        class_transformer_1.Type(function () { return ItemVentaDto; })
    ], ProcesarVentaDulceriaDto.prototype, "items");
    return ProcesarVentaDulceriaDto;
}());
exports.ProcesarVentaDulceriaDto = ProcesarVentaDulceriaDto;
