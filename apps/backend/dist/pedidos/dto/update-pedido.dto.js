"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePedidoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_pedido_dto_1 = require("./create-pedido.dto");
const client_1 = require("@prisma/client");
class UpdatePedidoDto extends (0, swagger_1.PartialType)(create_pedido_dto_1.CreatePedidoDto) {
}
exports.UpdatePedidoDto = UpdatePedidoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado del pedido', enum: client_1.PedidoEstado, required: false }),
    (0, class_validator_1.IsEnum)(client_1.PedidoEstado),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePedidoDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Si el pedido fue entregado', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePedidoDto.prototype, "entregado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de entrega', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePedidoDto.prototype, "fechaEntrega", void 0);
//# sourceMappingURL=update-pedido.dto.js.map