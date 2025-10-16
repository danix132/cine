"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateItemDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var UpdateItemDto = /** @class */ (function () {
    function UpdateItemDto() {
    }
    __decorate([
        swagger_1.ApiPropertyOptional({ example: 2, minimum: 1 }),
        class_validator_1.IsOptional(),
        class_validator_1.IsInt(),
        class_validator_1.Min(1)
    ], UpdateItemDto.prototype, "cantidad");
    __decorate([
        swagger_1.ApiPropertyOptional({ example: 160.00, minimum: 0 }),
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber(),
        class_validator_1.Min(0)
    ], UpdateItemDto.prototype, "precioUnitario");
    return UpdateItemDto;
}());
exports.UpdateItemDto = UpdateItemDto;
