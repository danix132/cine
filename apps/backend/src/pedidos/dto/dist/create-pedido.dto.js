"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreatePedidoDto = exports.CreatePedidoItemDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var CreatePedidoItemDto = /** @class */ (function () {
    function CreatePedidoItemDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ description: 'Tipo de item', "enum": client_1.PedidoItemTipo }),
        class_validator_1.IsEnum(client_1.PedidoItemTipo),
        class_validator_1.IsNotEmpty()
    ], CreatePedidoItemDto.prototype, "tipo");
    __decorate([
        swagger_1.ApiProperty({ description: 'ID de referencia (boleto o dulcería)' }),
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty()
    ], CreatePedidoItemDto.prototype, "referenciaId");
    __decorate([
        swagger_1.ApiProperty({ description: 'Descripción del item', required: false }),
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreatePedidoItemDto.prototype, "descripcion");
    __decorate([
        swagger_1.ApiProperty({ description: 'Cantidad' }),
        class_validator_1.IsNumber(),
        class_validator_1.IsNotEmpty()
    ], CreatePedidoItemDto.prototype, "cantidad");
    __decorate([
        swagger_1.ApiProperty({ description: 'Precio unitario' }),
        class_validator_1.IsNumber(),
        class_validator_1.IsNotEmpty()
    ], CreatePedidoItemDto.prototype, "precio");
    __decorate([
        swagger_1.ApiProperty({ description: 'Precio unitario (compatibilidad)' }),
        class_validator_1.IsNumber(),
        class_validator_1.IsNotEmpty()
    ], CreatePedidoItemDto.prototype, "precioUnitario");
    __decorate([
        swagger_1.ApiProperty({ description: 'Subtotal del item', required: false }),
        class_validator_1.IsNumber(),
        class_validator_1.IsOptional()
    ], CreatePedidoItemDto.prototype, "subtotal");
    return CreatePedidoItemDto;
}());
exports.CreatePedidoItemDto = CreatePedidoItemDto;
var CreatePedidoDto = /** @class */ (function () {
    function CreatePedidoDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ description: 'ID del usuario (opcional)' }),
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreatePedidoDto.prototype, "usuarioId");
    __decorate([
        swagger_1.ApiProperty({ description: 'ID del vendedor (opcional)' }),
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreatePedidoDto.prototype, "vendedorId");
    __decorate([
        swagger_1.ApiProperty({ description: 'Total del pedido' }),
        class_validator_1.IsNumber(),
        class_validator_1.IsNotEmpty()
    ], CreatePedidoDto.prototype, "total");
    __decorate([
        swagger_1.ApiProperty({ description: 'Tipo de pedido', "enum": client_1.PedidoTipo }),
        class_validator_1.IsEnum(client_1.PedidoTipo),
        class_validator_1.IsNotEmpty()
    ], CreatePedidoDto.prototype, "tipo");
    __decorate([
        swagger_1.ApiProperty({ description: 'Items del pedido', type: [CreatePedidoItemDto] }),
        class_validator_1.IsArray(),
        class_validator_1.IsNotEmpty()
    ], CreatePedidoDto.prototype, "items");
    return CreatePedidoDto;
}());
exports.CreatePedidoDto = CreatePedidoDto;
