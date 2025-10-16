"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateBoletoDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var CreateBoletoDto = /** @class */ (function () {
    function CreateBoletoDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ description: 'ID de la función' }),
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty()
    ], CreateBoletoDto.prototype, "funcionId");
    __decorate([
        swagger_1.ApiProperty({ description: 'ID del asiento' }),
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty()
    ], CreateBoletoDto.prototype, "asientoId");
    __decorate([
        swagger_1.ApiProperty({ description: 'ID del usuario (opcional)' }),
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateBoletoDto.prototype, "usuarioId");
    __decorate([
        swagger_1.ApiProperty({ description: 'Estado del boleto', "enum": ['RESERVADO', 'PAGADO', 'CANCELADO'] }),
        class_validator_1.IsEnum(['RESERVADO', 'PAGADO', 'CANCELADO']),
        class_validator_1.IsOptional()
    ], CreateBoletoDto.prototype, "estado");
    __decorate([
        swagger_1.ApiProperty({ description: 'ID del vendedor (requerido para ventas en efectivo)', required: false }),
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateBoletoDto.prototype, "vendedorId");
    __decorate([
        swagger_1.ApiProperty({ description: 'Precio del boleto (opcional, se usa el de la función si no se especifica)', required: false }),
        class_validator_1.IsNumber(),
        class_validator_1.Min(0),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsOptional()
    ], CreateBoletoDto.prototype, "precio");
    return CreateBoletoDto;
}());
exports.CreateBoletoDto = CreateBoletoDto;
